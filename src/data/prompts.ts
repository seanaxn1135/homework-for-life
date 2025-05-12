export const PROMPTS = [
  // Core & Direct
  "What was your story-worthy moment today?",
  "What's one moment from today you'll want to remember?",
  "Reflect on your day: what tiny scene stands out?",
  "What was today's most vivid five-second moment?",
  "Capture a moment from today that held a little story.",

  // Guiding Towards Emotion & Significance (Subtly)
  "What moment today made you *feel* something distinctly?",
  "Where did a shift in emotion happen for you today?",
  "What encounter or event today left an impression on your heart?",
  "Describe a moment today that felt uniquely *yours*.",
  "What part of today resonated with you long after it passed?",
  "If you were to tell one brief story about today, what would its seed be?",
  "What small moment held unexpected weight or meaning today?",

  // Guiding Towards Observation & The Unexpected (Subtly)
  "What detail from today might make a good story later?",
  "When did the ordinary feel a little extraordinary today?",
  "What unexpected turn, however small, did your day take?",
  "Describe a snapshot from today – a single, clear image in your mind.",
  "What was an interesting observation you made about the world or people around you?",
  "What moment today broke the pattern of your routine?",
  "Did anything catch you by surprise today?",
  "What little 'blip' on the radar of your day is worth noting?",

  // Encouraging Broader Reflection on "Story-Worthiness"
  "What moment today contained a beginning, a middle, or an end (even a tiny one)?",
  "If today was a chapter, what moment defined it?",
  "What's a small truth your day revealed to you?",
  "What experience today could you build a larger narrative around?",
  "What part of today felt most 'alive'?",
  "Think about the 'stakes' of your day: what moment had even tiny stakes involved?",
  "What moment today illustrates something about who you are or what you value?",
  "Where was the 'change' in today? (A change in state, emotion, understanding, location)",
  "What seemingly mundane moment today had an undercurrent of something more?",
  "If you had to find the 'story' in today, where would it be?",

  // Playful & Slightly Different Angle
  "What was today's 'slice of life' highlight?",
  "What was the 'secret' story-worthy moment of your day (one others might not have noticed)?",
  "If today had a hidden gem, what was it?",
  "What's a moment from today that, if written down, might bring a smile (or a thought) later?",

  // Additional Open Prompts
  "What fleeting moment today do you want to hold onto?",
  "Describe a point where your day took a specific 'flavor' or tone.",
  "What interaction today had a subtle spark to it?",
  "If you were collecting interesting daily 'specimens,' what would you collect from today?",
  "What was a quiet observation or internal thought that felt significant?",
  "What was the most human moment you experienced or witnessed today?",
  "Capture a fragment of today that feels complete in itself.",
  "What moment whispers a bigger story?",
  "What was an authentic moment from your day?",
  "What unexpected connection (to a person, place, thing, or idea) did you make today?",
] as const

export type Prompt = (typeof PROMPTS)[number]
