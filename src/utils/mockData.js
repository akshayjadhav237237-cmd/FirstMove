// Detect scenario by keywords in ideaText.toLowerCase()
export function getScenario(ideaText) {
  const text = (ideaText || "").toLowerCase();
  if (
    text.includes("3d") ||
    text.includes("tour") ||
    text.includes("flat") ||
    text.includes("rental") ||
    text.includes("pune")
  ) {
    return "A";
  } else if (
    text.includes("internship") ||
    text.includes("student") ||
    text.includes("application") ||
    text.includes("college")
  ) {
    return "B";
  } else {
    return "C";
  }
}

export function getMockClarify(ideaText) {
  const scenario = getScenario(ideaText);

  if (scenario === "A") {
    return {
      socratic_questions: [
        {
          id: "q1",
          target_variable: "LANDLORD_ADOPTION",
          question_text: "What makes you sure busy Pune landlords will take the time to film their own apartments rather than delegating it to brokers?",
          contextual_rationale: "If landlords won't record the videos, you will need a marketplace of photographers, which changes the unit economics."
        },
        {
          id: "q2",
          target_variable: "WILLINGNESS_TO_PAY",
          question_text: "Why would landlords pay ₹500–₹2000 per tour instead of using standard free photos or WhatsApp video calls?",
          contextual_rationale: "Indian rental platforms are crowded with free alternatives. We need to identify if landlords see remote video tours as a paid service."
        },
        {
          id: "q3",
          target_variable: "VISUAL_QUALITY_THRESHOLD",
          question_text: "How will you handle poor indoor lighting and shaky footage filmed by amateurs without the output looking low-quality to tenants?",
          contextual_rationale: "Gaussian splatting depends heavily on lighting. If the quality is poor, tenants won't rely on it to make decisions."
        }
      ]
    };
  } else if (scenario === "B") {
    return {
      socratic_questions: [
        {
          id: "q1",
          target_variable: "PROBLEM_ROOT_CAUSE",
          question_text: "Are students actually missing out on internships due to disorganized tracking, or is the core bottleneck their resume quality?",
          contextual_rationale: "If application quality is the real issue, tracking software won't improve their outcomes or drive engagement."
        },
        {
          id: "q2",
          target_variable: "WILLINGNESS_TO_PAY",
          question_text: "Since students have zero budget and free alternatives like Notion and Excel exist, what specific feature makes them pay ₹99/month?",
          contextual_rationale: "Students are extremely price-sensitive. Identifying a highly valued paid feature early prevents building a free-only tool."
        },
        {
          id: "q3",
          target_variable: "RETENTION_DRIVER",
          question_text: "How do you keep students using the tracker daily after they finish applying for the season?",
          contextual_rationale: "Application periods are highly seasonal. Low retention outside peak months could kill organic growth."
        }
      ]
    };
  } else {
    return {
      socratic_questions: [
        {
          id: "q1",
          target_variable: "USER_PRIORITY",
          question_text: "Is identifying execution assumptions a top priority for early-stage builders, or do they just want to write code and launch?",
          contextual_rationale: "If builders prefer action over planning, they will ignore a Socratic advisor, meaning you have no active users."
        },
        {
          id: "q2",
          target_variable: "WILLINGNESS_TO_PAY",
          question_text: "Why would a founder pay for this structured validation instead of using free AI chat prompts or online template sheets?",
          contextual_rationale: "If they can replicate this with a free ChatGPT prompt, you cannot charge for the software."
        },
        {
          id: "q3",
          target_variable: "DELIVERY_FORMAT",
          question_text: "What output format (PDF, interactive dashboard, task list) makes this plan feel immediately actionable rather than static homework?",
          contextual_rationale: "A plan that is hard to execute gets abandoned. The interface format dictates the actual utility."
        }
      ]
    };
  }
}

export function getMockBlueprint(ideaText) {
  const scenario = getScenario(ideaText);

  if (scenario === "A") {
    return {
      sharpened_problem_statement: "Pune rental landlords need an affordable way to create 3D property tours that convince remote tenants without requiring technical skills or expensive equipment.",
      assumptions_matrix: [
        {
          id: "a1",
          dimension: "DESIRABILITY",
          assumption_statement: "Pune landlords with zero tech experience will voluntarily record their own property walkthroughs using just a smartphone.",
          confidence_assessment: {
            confidence_score: 38,
            qualitative_label: "LOW",
            contributing_factors: [
              "No evidence landlords currently use any digital tools for listings",
              "Target user demographic skews older and less tech-comfortable",
              "Manual workaround (in-person visits) already exists and works"
            ]
          }
        },
        {
          id: "a2",
          dimension: "VIABILITY",
          assumption_statement: "Landlords will pay ₹500–₹2000 per tour rather than offering the service free to attract tenants.",
          confidence_assessment: {
            confidence_score: 42,
            qualitative_label: "LOW",
            contributing_factors: [
              "Indian rental market heavily transactional — landlords expect tenants to come to them",
              "No direct comparable paid product exists to anchor pricing",
              "Competing free alternative: simply post photos on housing portals"
            ]
          }
        },
        {
          id: "a3",
          dimension: "FEASIBILITY",
          assumption_statement: "Smartphone video processed through a free Gaussian splatting pipeline produces output quality acceptable to prospective tenants.",
          confidence_assessment: {
            confidence_score: 61,
            qualitative_label: "MODERATE",
            contributing_factors: [
              "Nerfstudio + free T4 Colab GPU pipeline is technically viable",
              "Quality is heavily dependent on recording conditions — lighting, movement speed",
              "Unknown: whether typical Indian apartment lighting produces usable splats"
            ]
          }
        }
      ],
      prioritized_roadmap: [
        {
          sequence_number: 1,
          target_assumptions: ["a1"],
          mitigation_action: "Interview 10 Pune landlords currently using housing portals. Ask: 'Tell me about the last tenant you found. How did you show them the flat before they visited?' Do NOT mention your idea.",
          test_metrics: "5 of 10 landlords describe a pain point with remote tenant qualification. At least 3 have tried a workaround (video call, photos, WhatsApp video)."
        },
        {
          sequence_number: 2,
          target_assumptions: ["a2"],
          mitigation_action: "At end of 3 interviews where pain is confirmed, say 'We can do this for ₹800 per flat.' Track exact response — not 'would you pay' but whether they ask follow-up questions or go quiet.",
          test_metrics: "2 of 5 landlords ask a follow-up question about the service (delivery time, format, etc.) rather than immediately saying no."
        },
        {
          sequence_number: 3,
          target_assumptions: ["a3"],
          mitigation_action: "Film your own room in 3 lighting conditions (bright day, overcast, indoor light only). Run all 3 through Nerfstudio on free Colab T4. Show outputs to 5 people cold — ask 'Would you trust this to decide if you wanted to visit?'",
          test_metrics: "4 of 5 people say yes for at least 1 lighting condition."
        }
      ],
      immediate_next_step: {
        action_item: "Go to a housing portal (99acres or MagicBricks) and message 5 active Pune landlords asking if you can ask them 3 quick questions about how they find tenants — this week, not next week.",
        objective: "Prove that landlords experience genuine friction with remote tenant qualification before building anything."
      }
    };
  } else if (scenario === "B") {
    return {
      sharpened_problem_statement: "College students applying to multiple internships simultaneously lose track of deadlines and follow-up actions because their process is scattered across email, spreadsheets, and messaging apps.",
      assumptions_matrix: [
        {
          id: "a1",
          dimension: "DESIRABILITY",
          assumption_statement: "Students lose internship opportunities specifically because of disorganized tracking — not because of poor applications or lack of opportunities.",
          confidence_assessment: {
            confidence_score: 55,
            qualitative_label: "MODERATE",
            contributing_factors: [
              "Disorganized tracking is a real and reported problem in student communities",
              "Competing explanation: rejections are more often due to resume quality or competition",
              "Many students already use improvised spreadsheets — suggesting the pain is real but partially solved"
            ]
          }
        },
        {
          id: "a2",
          dimension: "VIABILITY",
          assumption_statement: "Students will pay for a premium tier after using a free version — rather than staying on free forever or switching to a competitor.",
          confidence_assessment: {
            confidence_score: 31,
            qualitative_label: "LOW",
            contributing_factors: [
              "Students are high price-sensitivity users with near-zero budget",
              "Notion, Google Sheets, and Trello all offer free alternatives",
              "No evidence of willingness-to-pay without a tested conversion funnel"
            ]
          }
        },
        {
          id: "a3",
          dimension: "FEASIBILITY",
          assumption_statement: "A two-person team can build a usable tracking MVP — with reminders, status tracking, and deadline alerts — within 2 weeks without a full backend.",
          confidence_assessment: {
            confidence_score: 74,
            qualitative_label: "MODERATE",
            contributing_factors: [
              "Core feature set is well-defined and technically straightforward",
              "React + Supabase can handle this without custom backend infrastructure",
              "Risk: scope creep — reminder and notification systems add significant complexity"
            ]
          }
        }
      ],
      prioritized_roadmap: [
        {
          sequence_number: 1,
          target_assumptions: ["a2"],
          mitigation_action: "Post in 3 college student WhatsApp groups or Discord servers: 'Would you pay ₹99/month for a tool that tracks all your internship applications and reminds you to follow up?' Collect 50 responses.",
          test_metrics: "Over 20% say yes AND follow up with a question about features. Below 10% means the business model needs rethinking before building."
        },
        {
          sequence_number: 2,
          target_assumptions: ["a1"],
          mitigation_action: "Interview 8 students who applied to 5+ internships last semester. Ask: 'Walk me through how you tracked your applications. What happened when you forgot to follow up?' Listen for emotional frustration, not logical agreement.",
          test_metrics: "5 of 8 describe a specific instance where disorganization caused a missed deadline or follow-up. Unsolicited mentions of wanting a tool = strong signal."
        },
        {
          sequence_number: 3,
          target_assumptions: ["a3"],
          mitigation_action: "Build a single-screen MVP: add application, set deadline, mark status. No reminders yet. Share with 10 students and watch them use it for 1 week.",
          test_metrics: "7 of 10 students add at least 3 applications without being prompted. 4 of 10 return after day 1."
        }
      ],
      immediate_next_step: {
        action_item: "Open your college WhatsApp group right now and post: 'Quick question — how do you currently track internship applications? Spreadsheet, Notion, memory, or something else?' Count the responses and note which answers show frustration.",
        objective: "Confirm the problem is real and widespread before writing a single line of code."
      }
    };
  } else {
    return {
      sharpened_problem_statement: "Early-stage builders waste their first month executing the wrong assumption because they have no structured way to identify which beliefs about their idea are most likely to be wrong.",
      assumptions_matrix: [
        {
          id: "a1",
          dimension: "DESIRABILITY",
          assumption_statement: "Target users experience this problem frequently enough that solving it is a genuine priority — not a nice-to-have.",
          confidence_assessment: {
            confidence_score: 45,
            qualitative_label: "LOW",
            contributing_factors: [
              "No behavioral evidence collected yet — assumption is based on personal intuition",
              "Frequency of the problem has not been validated through user interviews",
              "Existing workarounds may already be 'good enough' for most users"
            ]
          }
        },
        {
          id: "a2",
          dimension: "VIABILITY",
          assumption_statement: "Users will pay for this solution rather than building their own workaround or using a free alternative.",
          confidence_assessment: {
            confidence_score: 35,
            qualitative_label: "LOW",
            contributing_factors: [
              "No pricing conversations have happened with target users",
              "Free alternatives likely exist or can be assembled from existing tools",
              "Willingness-to-pay is almost always lower than founders expect at idea stage"
            ]
          }
        },
        {
          id: "a3",
          dimension: "FEASIBILITY",
          assumption_statement: "The core value proposition can be built and delivered by this team within the resources currently available.",
          confidence_assessment: {
            confidence_score: 62,
            qualitative_label: "MODERATE",
            contributing_factors: [
              "Team has demonstrated ability to ship working software",
              "Unclear whether the core technical challenge has been attempted before",
              "Resource and time constraints have not been formally mapped against scope"
            ]
          }
        }
      ],
      prioritized_roadmap: [
        {
          sequence_number: 1,
          target_assumptions: ["a1"],
          mitigation_action: "Identify 10 people who would be your ideal user. Call or message them this week. Ask: 'Tell me about the last time you faced [this problem]. What did you do?' Don't mention your idea at all.",
          test_metrics: "7 of 10 describe a specific instance of the problem unprompted. At least 3 have an active workaround they're unhappy with."
        },
        {
          sequence_number: 2,
          target_assumptions: ["a2"],
          mitigation_action: "In your next 3 conversations where the problem is confirmed, say 'We're building something that solves this. It would cost [price]. Does that make sense to you?' Track whether they ask follow-up questions or go quiet.",
          test_metrics: "2 of 5 ask a follow-up question about the product (timeline, format, features) rather than immediately saying it's too expensive or they'd figure it out themselves."
        },
        {
          sequence_number: 3,
          target_assumptions: ["a3"],
          mitigation_action: "Build the smallest possible version that delivers the core value — one screen, one action, no extras. Show it to the people who confirmed the problem in step 1.",
          test_metrics: "3 of 5 use it without being coached. At least 1 asks when it will be ready or how to get access."
        }
      ],
      immediate_next_step: {
        action_item: "Write down the name of one real person who you believe has this problem. Text them today asking if you can ask them 3 questions about how they currently handle it. Do not mention your idea.",
        objective: "Replace assumption a1 with real behavioral evidence before committing any more time to building."
      }
    };
  }
}
