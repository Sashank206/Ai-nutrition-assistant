const axios = require("axios");
const User = require("../models/User");

// Helper to retrieve IAM Access Token from IBM Cloud
const getIBMIamToken = async (apiKey) => {
  try {
    const response = await axios.post(
      "https://iam.cloud.ibm.com/identity/token",
      new URLSearchParams({
        grant_type: "urn:ibm:params:oauth:grant-type:apikey",
        apikey: apiKey,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error retrieving IBM IAM Token:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with IBM Cloud services.");
  }
};

// Helper to invoke Granite LLM on Watsonx.ai
const queryIBMxGranite = async (prompt, token, projectId) => {
  try {
    const response = await axios.post(
      "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29",
      {
        model_id: "ibm/granite-13b-instruct-v2",
        input: prompt,
        parameters: {
          decoding_method: "greedy",
          max_new_tokens: 150,
          min_new_tokens: 1,
          stop_sequences: [],
          repetition_penalty: 1.0,
        },
        project_id: projectId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    
    // Extract generated text from Watsonx response
    const results = response.data?.results;
    if (results && results.length > 0) {
      return results[0].generated_text.trim();
    }
    throw new Error("Empty response returned from IBM Granite.");
  } catch (error) {
    console.error("Error calling IBM Granite API:", error.response?.data || error.message);
    throw new Error("Watsonx.ai inference failed.");
  }
};

// AI Chatbot Advice Controller
exports.getChatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const name = user.name || "User";
    const goal = user.goal || "maintain";
    const dietType = user.dietType || "veg";
    const weight = user.weight || 70;
    const height = user.height || 170;

    const apiKey = process.env.WATSONX_API_KEY;
    const projectId = process.env.WATSONX_PROJECT_ID;

    // IF IBM credentials are setup, call Watsonx.ai
    if (apiKey && projectId) {
      try {
        const token = await getIBMIamToken(apiKey);
        
        // Compute BMI and suggested targets
        const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);
        let recommendedCalories = 2000;
        if (goal === "weight_loss") recommendedCalories = 1800;
        if (goal === "weight_gain") recommendedCalories = 2500;

        // Structured prompt template matching design specification
        const formattedPrompt = `System: You are an expert AI Nutritionist. Answer user inquiries using clean, concise health guidelines. Keep recommendations realistic.
User Profile context:
- Weight: ${weight} kg
- Height: ${height} cm
- BMI: ${bmi}
- Goal: ${goal}
- Diet Type: ${dietType}
- Target Calories: ${recommendedCalories} kcal

User Inquiry: ${message}
AI Nutritionist Response:`;

        const reply = await queryIBMxGranite(formattedPrompt, token, projectId);
        return res.status(200).json({ reply });
      } catch (ibmError) {
        console.warn("IBM Service failed, falling back to local advice rule engine:", ibmError.message);
      }
    }

    // Local fallback rules (trial optimization mode)
    let responseText = "";
    const prompt = message.toLowerCase();

    if (prompt.includes("hello") || prompt.includes("hi") || prompt.includes("hey")) {
      responseText = `Hello ${name}! 👋 I am your AI Nutrition Assistant. How can I help you reach your goals to ${goal.replace("_", " ")} today?`;
    } else if (prompt.includes("protein")) {
      if (goal === "weight_gain") {
        responseText = `To support your weight gain goal, I recommend aiming for around ${(weight * 2).toFixed(0)}g of protein daily. Excellent ${dietType === "veg" ? "vegetarian options include Paneer, Greek yogurt, lentils, and tofu" : "options include chicken breast, eggs, fish, and Greek yogurt"}.`;
      } else {
        responseText = `Protein is key for muscle retention and satiety. Aim for ${(weight * 1.6).toFixed(0)}g of protein daily. Focus on lean sources like ${dietType === "veg" ? "paneer, lentils, tempeh, and protein shakes" : "chicken, eggs, white fish, and turkey"}.`;
      }
    } else if (prompt.includes("water") || prompt.includes("hydrate") || prompt.includes("hydration")) {
      responseText = `Based on your weight of ${weight}kg, you should aim for about ${(weight * 35 / 1000).toFixed(1)} liters of water per day. Staying hydrated is vital for metabolic function and cognitive clarity.`;
    } else if (prompt.includes("snack")) {
      if (goal === "weight_loss") {
        responseText = `For weight loss, low-calorie volume snacks are best. Try cucumber slices with hummus, a handful of berries, or air-popped popcorn.`;
      } else if (goal === "weight_gain") {
        responseText = `For weight gain, energy-dense snacks are key. Try peanut butter on rice cakes, mixed nuts, a banana-protein smoothie, or avocado toast.`;
      } else {
        responseText = `Try a balanced snack: Apple slices with almond butter, greek yogurt with honey, or a small handful of mixed nuts.`;
      }
    } else if (prompt.includes("breakfast")) {
      if (dietType === "veg") {
        responseText = `A great vegetarian breakfast for you: Oatmeal with chia seeds, banana, and a scoop of protein powder, or a paneer scramble with whole wheat toast.`;
      } else {
        responseText = `A great high-protein breakfast: 3 scrambled eggs with spinach, avocado, and a slice of sourdough bread.`;
      }
    } else if (prompt.includes("peanut butter")) {
      responseText = `Peanut butter is an excellent source of healthy fats and protein! However, it is energy-dense (approx. 90-100 kcal per tablespoon), so keep portions to 1-2 tbsp if your goal is weight loss.`;
    } else if (prompt.includes("deficit") || prompt.includes("lose") || prompt.includes("fat")) {
      responseText = `To lose fat safely, aim for a moderate calorie deficit of 300-500 kcal below your maintenance levels. Combine this with 10k steps daily and weight training to protect muscle mass.`;
    } else if (prompt.includes("surplus") || prompt.includes("gain") || prompt.includes("bulk")) {
      responseText = `To build muscle with minimal fat gain, aim for a clean surplus of 250-300 kcal above maintenance. Keep protein high and focus on progressive overload in the gym!`;
    } else if (prompt.includes("recipe") || prompt.includes("cook")) {
      responseText = `Here is a quick 15-minute recipe for a ${dietType === "veg" ? "Tofu & Quinoa bowl: Cook 1/2 cup quinoa, pan-sear 150g cubed tofu with soy sauce and ginger, toss with steamed broccoli, and drizzle with sesame oil" : "Chicken & Rice bowl: Pan-fry 150g sliced chicken breast with garlic and herbs, serve over 1 cup basmati rice with a side of mixed greens and olive oil"}.`;
    } else {
      responseText = `That's a great question! For a person aiming to ${goal.replace("_", " ")}, I recommend focusing on whole foods, matching your daily calorie allowance, and maintaining consistency. Feel free to ask about specific foods, hydration guidelines, or meal logging!`;
    }

    res.status(200).json({ reply: responseText });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
