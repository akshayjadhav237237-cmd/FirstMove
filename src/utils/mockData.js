function getScenario(ideaText) {
  const t = (ideaText || "").toLowerCase();
  if (t.includes("3d") || t.includes("tour") || t.includes("flat") || t.includes("rental") || t.includes("pune")) return "A";
  if (t.includes("internship") || t.includes("student") || t.includes("college") || t.includes("application")) return "B";
  return "C";
}

export function getMockClarify(ideaText) {
  const s = getScenario(ideaText);
  if (s === "A") {
    return {
      socratic_questions: [
        { id: "q1", target_variable: "LANDLORD_ADOPTION", question_text: "What makes you sure busy Pune landlords will film their own apartments rather than delegating it to brokers?", contextual_rationale: "If landlords won't record the videos, you'll need a marketplace of photographers — which changes your unit economics entirely." },
        { id: "q2", target_variable: "WILLINGNESS_TO_PAY", question_text: "Why would a landlord pay ₹500–₹2000 per tour instead of just posting standard photos or doing a WhatsApp video call?", contextual_rationale: "Indian rental platforms are crowded with free alternatives. The paid value proposition needs to be specific." },
        { id: "q3", target_variable: "VISUAL_QUALITY_THRESHOLD", question_text: "How will you handle poor indoor lighting and shaky footage filmed by amateurs without the output looking low-quality to tenants?", contextual_rationale: "Gaussian splatting quality depends heavily on lighting. If output quality is poor, tenants won't use it to make decisions." }
      ]
    };
  }
  if (s === "B") {
    return {
      socratic_questions: [
        { id: "q1", target_variable: "PROBLEM_ROOT_CAUSE", question_text: "When students miss internship opportunities, is it because they forgot to follow up, or because they didn't apply strongly enough in the first place?", contextual_rationale: "Tracking tools solve the first problem. If the real problem is application quality or competition, a tracker won't change outcomes." },
        { id: "q2", target_variable: "SWITCHING_COST", question_text: "What specifically is broken about the Google Sheets or Notion templates students already use to track applications?", contextual_rationale: "If free tools already work adequately, your product needs a 10x improvement, not a marginal one, to justify switching." },
        { id: "q3", target_variable: "MONETIZATION_PATHWAY", question_text: "Who pays — the student, their college, or a recruiter — and what specific outcome would make them open their wallet?", contextual_rationale: "Students have near-zero disposable income. B2B (college/recruiter) monetization requires a completely different product." }
      ]
    };
  }
  return {
    socratic_questions: [
      { id: "q1", target_variable: "TARGET_USER_SPECIFICITY", question_text: "Who is the single most specific person experiencing this problem right now — their job title, daily workflow, and what they tried before?", contextual_rationale: "Generic users produce generic plans. The more specific your user, the more credible your assumptions become." },
      { id: "q2", target_variable: "EXISTING_WORKAROUND", question_text: "What does your target user do today to solve this problem — and what's the exact moment that workaround breaks down?", contextual_rationale: "The moment the workaround fails is where your product lives. Without knowing this, you're building in the dark." },
      { id: "q3", target_variable: "SUCCESS_DEFINITION", question_text: "What would your user be able to do in 30 days that they can't do today — and how would you know it worked?", contextual_rationale: "A measurable 30-day outcome forces you to define the minimum version of success worth building toward." }
    ]
  };
}

export function getMockAnalyze(ideaText) {
  const s = getScenario(ideaText);

  if (s === "A") {
    return {
      debate: {
        strategist: {
          verdict: "The Pune rental market is ripe for digital disruption. Remote workers relocating from other cities are actively seeking ways to shortlist flats without visiting each one. A 3D tour product that works on a smartphone could capture this demand before any major platform moves into the space.",
          key_points: [
            "Remote relocation demand is measurably growing post-2023 in Pune tech corridors",
            "First-mover advantage is real — no local player offers smartphone-to-3D-tour at sub-₹2000",
            "Network effects kick in once enough listings exist — tenants bring landlords"
          ],
          opportunity_score: 71
        },
        risk_analyst: {
          verdict: "Two assumptions carry critical risk. Landlord willingness to self-record is unvalidated and historically low in the Indian market. And the technical quality bar for Gaussian splatting from consumer smartphones under variable lighting is not yet established for this use case.",
          key_points: [
            "Indian landlords historically rely on brokers — self-service behavior is not established",
            "WhatsApp video calls already solve the remote preview problem for free",
            "Processing time on free Colab T4 may be too slow for commercial use (30–90 mins per flat)"
          ],
          risk_score: 74
        },
        devils_advocate: {
          verdict: "The core premise assumes tenants want 3D tours when they actually want trust. A professional photographer with a DSLR builds more tenant trust than a janky smartphone splat. And why would a landlord with 5 active inquiries spend 2 hours learning to film their flat?",
          key_points: [
            "The problem being solved may be 'tenant trust', not 'viewing convenience' — different solution",
            "Brokers already offer this service manually and landlords are comfortable paying them",
            "Competing with 99acres and MagicBricks on discovery is a different war than competing on tour quality"
          ],
          challenge_score: 68
        }
      },
      blueprint: {
        sharpened_problem_statement: "Pune rental landlords need an affordable way to create 3D property tours that convince remote tenants without requiring technical skills or expensive equipment.",
        assumptions_matrix: [
          { id: "a1", dimension: "DESIRABILITY", assumption_statement: "Pune landlords with zero tech experience will voluntarily record their own property walkthroughs using just a smartphone.", confidence_assessment: { confidence_score: 38, qualitative_label: "LOW", contributing_factors: ["No evidence landlords currently use any digital tools for listings", "Target demographic skews older and less tech-comfortable", "Manual workaround (in-person visits) already exists and works"] } },
          { id: "a2", dimension: "VIABILITY", assumption_statement: "Landlords will pay ₹500–₹2000 per tour rather than using standard photos or WhatsApp video calls.", confidence_assessment: { confidence_score: 42, qualitative_label: "LOW", contributing_factors: ["Indian rental market is heavily transactional — landlords expect tenants to come to them", "No direct comparable paid product exists to anchor pricing expectations", "Competing free alternative: post photos on 99acres"] } },
          { id: "a3", dimension: "FEASIBILITY", assumption_statement: "Smartphone video through a free Gaussian splatting pipeline produces output quality acceptable to prospective tenants.", confidence_assessment: { confidence_score: 61, qualitative_label: "MODERATE", contributing_factors: ["Nerfstudio + free T4 Colab GPU pipeline is technically viable", "Quality heavily dependent on recording conditions — lighting, movement speed", "Unknown: whether typical Indian apartment lighting produces usable splats"] } }
        ],
        prioritized_roadmap: [
          { sequence_number: 1, target_assumptions: ["a1"], mitigation_action: "Interview 10 Pune landlords on 99acres. Ask: 'Tell me about the last tenant you found. How did you show them the flat before they visited?' Do NOT mention your idea.", test_metrics: "5 of 10 describe pain with remote tenant qualification. At least 3 have tried a workaround (video call, photos, WhatsApp video)." },
          { sequence_number: 2, target_assumptions: ["a2"], mitigation_action: "In 3 interviews where pain is confirmed, say 'We can do this for ₹800 per flat.' Track whether they ask follow-up questions or go quiet.", test_metrics: "2 of 5 landlords ask a follow-up question (delivery time, format) rather than immediately saying no." },
          { sequence_number: 3, target_assumptions: ["a3"], mitigation_action: "Film your own room in 3 lighting conditions. Run all 3 through Nerfstudio on free Colab T4. Show outputs to 5 people — ask 'Would you trust this to decide if you wanted to visit?'", test_metrics: "4 of 5 people say yes for at least 1 lighting condition." }
        ],
        immediate_next_step: {
          action_item: "Open 99acres right now and message 5 active Pune landlords asking if you can ask 3 quick questions about how they find tenants — today, not this week.",
          objective: "Prove landlords experience genuine friction with remote tenant qualification before building anything."
        },
        scenarios: {
          optimistic: { probability: 0.20, headline: "PropTech category leader in Pune remote rentals by month 8", key_conditions: ["Landlords adopt self-recording after 2-min onboarding video", "Output quality clears tenant trust threshold in testing"], impact_score: 9, estimated_timeline: "8 months" },
          neutral:    { probability: 0.55, headline: "Niche tool for tech-savvy landlords, slow organic growth", key_conditions: ["Some landlords adopt it but majority still prefer brokers", "Quality is acceptable but not impressive enough to go viral"], impact_score: 5, estimated_timeline: "18 months" },
          pessimistic:{ probability: 0.25, headline: "Landlords won't self-record — pivot required", key_conditions: ["Adoption blocked by tech resistance in target demographic", "WhatsApp video calls remain the dominant solution"], impact_score: 2, estimated_timeline: "Never at this angle" }
        }
      }
    };
  }

  if (s === "B") {
    return {
      debate: {
        strategist: {
          verdict: "The internship coordination market is fragmented and underserved. No dominant tool exists for this specific use case — LinkedIn and Naukri solve discovery, not tracking. A well-designed tracker with smart reminders and status analytics could own this category at zero CAC through college communities.",
          key_points: [
            "TAM is large — every college student in India is a potential user",
            "Viral distribution is natural — students share tools within cohorts",
            "B2B pivot to career cells is a real monetization path if B2C doesn't convert"
          ],
          opportunity_score: 64
        },
        risk_analyst: {
          verdict: "The fundamental risk is that tracking is a solved problem. Notion, Sheets, and even plain WhatsApp reminders already work. The product needs to deliver dramatically better outcomes, not just a cleaner UI. And converting students to paid is historically near-impossible without institutional support.",
          key_points: [
            "Notion and Google Sheets are free, flexible, and already widely used",
            "Willingness-to-pay data for student productivity tools is consistently below ₹50/month",
            "Without reminders or outcome tracking, the core value is just a prettier spreadsheet"
          ],
          risk_score: 71
        },
        devils_advocate: {
          verdict: "Every founder believes students need better tracking tools. But talk to students and they'll tell you they miss opportunities because of imposter syndrome, not missed deadlines. A tracker that reminds you to follow up on a rejection doesn't solve the real emotional problem.",
          key_points: [
            "The pain may be emotional (fear of rejection) not operational (poor tracking)",
            "Most students abandon tracking tools within a week when job search anxiety peaks",
            "Success metric is 'got internship', not 'tracked 50 applications' — hard to attribute"
          ],
          challenge_score: 72
        }
      },
      blueprint: {
        sharpened_problem_statement: "College students applying to multiple internships lose track of follow-up deadlines because their process is scattered across email, spreadsheets, and messaging apps — causing missed opportunities that better organization would have prevented.",
        assumptions_matrix: [
          { id: "a1", dimension: "DESIRABILITY", assumption_statement: "Students lose internship opportunities specifically due to disorganized tracking — not due to application quality or competition.", confidence_assessment: { confidence_score: 52, qualitative_label: "LOW", contributing_factors: ["Tracking is a real reported pain but may not be the root cause of rejections", "Students already use improvised spreadsheets — suggesting partial solution exists", "Rejection is more often due to resume quality or competition level"] } },
          { id: "a2", dimension: "VIABILITY", assumption_statement: "Students will pay for premium features after using a free tier rather than staying free forever.", confidence_assessment: { confidence_score: 28, qualitative_label: "LOW", contributing_factors: ["Students are high price-sensitivity users with near-zero discretionary budget", "Notion, Sheets, and Trello offer free alternatives that work adequately", "No evidence of willingness-to-pay without a tested conversion funnel"] } },
          { id: "a3", dimension: "FEASIBILITY", assumption_statement: "A two-person team can build core tracking with reminders and status analytics in 2 weeks without a full backend.", confidence_assessment: { confidence_score: 76, qualitative_label: "MODERATE", contributing_factors: ["Core feature set is well-defined and technically straightforward", "React + Supabase handles this without custom backend infrastructure", "Risk: reminder and notification systems add significant complexity"] } }
        ],
        prioritized_roadmap: [
          { sequence_number: 1, target_assumptions: ["a2"], mitigation_action: "Post in 3 college WhatsApp groups: 'Would you pay ₹99/month for a tool that tracks internship applications and reminds you to follow up?' Collect 50 responses.", test_metrics: "Over 20% say yes AND ask a follow-up question about features. Below 10% means rethink monetization before building." },
          { sequence_number: 2, target_assumptions: ["a1"], mitigation_action: "Interview 8 students who applied to 5+ internships last semester. Ask: 'Walk me through how you tracked your applications. What happened when you forgot to follow up?'", test_metrics: "5 of 8 describe a specific instance of disorganization causing a missed deadline. Unsolicited mentions of wanting a tool = strong signal." },
          { sequence_number: 3, target_assumptions: ["a3"], mitigation_action: "Build single-screen MVP: add application, set deadline, mark status. No reminders yet. Share with 10 students and watch them use it for 1 week.", test_metrics: "7 of 10 add at least 3 applications without prompting. 4 of 10 return after day 1." }
        ],
        immediate_next_step: {
          action_item: "Open your college WhatsApp group right now and post: 'Quick question — how do you track internship applications? Spreadsheet, Notion, memory, or something else?' Count responses and note which show frustration.",
          objective: "Confirm the problem is real and widespread before writing a single line of code."
        },
        scenarios: {
          optimistic: { probability: 0.15, headline: "Viral campus adoption → B2B pivot to placement cells", key_conditions: ["Product spreads organically through college networks", "Placement officer demo converts 3+ colleges to institutional plan"], impact_score: 8, estimated_timeline: "10 months" },
          neutral:    { probability: 0.60, headline: "Loyal free user base, monetization remains difficult", key_conditions: ["Students use and love it but don't convert to paid", "Growth is steady but revenue doesn't follow"], impact_score: 4, estimated_timeline: "Ongoing" },
          pessimistic:{ probability: 0.25, headline: "Free tools win — users don't return after first week", key_conditions: ["Students try it but revert to WhatsApp and Sheets", "No feature is differentiated enough to justify switching cost"], impact_score: 1, estimated_timeline: "Never" }
        }
      }
    };
  }

  // Scenario C — Default
  return {
    debate: {
      strategist: {
        verdict: "Every successful product starts with a specific insight about a specific person. If you can articulate who your user is and what they do differently because of your product, you have the seed of something real. The opportunity exists — the question is whether the insight is specific enough to build from.",
        key_points: [
          "Specificity is the primary signal of a fundable idea at this stage",
          "Early validation costs almost nothing — 10 conversations can validate or kill an idea",
          "The right first step is always talk-to-users, not build-a-product"
        ],
        opportunity_score: 58
      },
      risk_analyst: {
        verdict: "At this stage, every assumption carries low confidence because none have been tested. The idea may be solving a real problem or it may be solving the founder's personal frustration — which is not always the same thing. Behavioral evidence needs to replace intuition before any resource is committed.",
        key_points: [
          "No behavioral evidence collected yet — plan is based entirely on intuition",
          "The problem frequency and intensity have not been validated through user interviews",
          "Existing workarounds may already be good enough for most users"
        ],
        risk_score: 77
      },
      devils_advocate: {
        verdict: "The strongest challenge to any new idea is: why hasn't this been built already? Either no one wants it, the market is too small, the problem is harder than it looks, or a large competitor will copy it the moment it gains traction. You need a crisp answer to all four before spending a month building.",
        key_points: [
          "If the problem is real, someone has probably tried to solve it already — know your graveyard",
          "The hardest founder question: is this my problem or everyone's problem?",
          "Willingness-to-pay is always lower than founders expect at idea stage"
        ],
        challenge_score: 80
      }
    },
    blueprint: {
      sharpened_problem_statement: "Early-stage builders commit time and resources to ideas without first identifying which core assumptions are most likely to be wrong — leading to wasted months building the wrong thing.",
      assumptions_matrix: [
        { id: "a1", dimension: "DESIRABILITY", assumption_statement: "Target users experience this problem frequently enough that solving it is a genuine priority rather than a nice-to-have.", confidence_assessment: { confidence_score: 40, qualitative_label: "LOW", contributing_factors: ["No behavioral evidence collected yet — based on personal intuition", "Problem frequency and intensity not validated through user interviews", "Existing workarounds may already be adequate for most users"] } },
        { id: "a2", dimension: "VIABILITY", assumption_statement: "Users will pay for this solution rather than building their own workaround or using a free alternative.", confidence_assessment: { confidence_score: 32, qualitative_label: "LOW", contributing_factors: ["No pricing conversations with target users yet", "Free alternatives likely exist or can be assembled from existing tools", "Willingness-to-pay is almost always lower than founders expect at idea stage"] } },
        { id: "a3", dimension: "FEASIBILITY", assumption_statement: "The core value proposition can be built and delivered by this team within current resource constraints.", confidence_assessment: { confidence_score: 65, qualitative_label: "MODERATE", contributing_factors: ["Team has demonstrated ability to ship working software", "Whether the core technical challenge has been solved before is unclear", "Resource and time constraints have not been mapped against scope"] } }
      ],
      prioritized_roadmap: [
        { sequence_number: 1, target_assumptions: ["a2"], mitigation_action: "Before building anything, have 5 pricing conversations. Ask 'How much are you currently spending to solve this problem?' Track actual numbers, not hypotheticals.", test_metrics: "3 of 5 people cite a specific cost (time or money) that exceeds your planned price point." },
        { sequence_number: 2, target_assumptions: ["a1"], mitigation_action: "Find 10 people who match your target user. Ask: 'Tell me about the last time you faced this problem. What did you do?' Don't mention your idea.", test_metrics: "7 of 10 describe a specific instance of the problem unprompted. At least 3 have an active workaround they're unhappy with." },
        { sequence_number: 3, target_assumptions: ["a3"], mitigation_action: "Build the smallest possible version — one screen, one action. Show it to the people who confirmed the problem in step 2.", test_metrics: "3 of 5 use it without coaching. At least 1 asks when it will be ready or how to get access." }
      ],
      immediate_next_step: {
        action_item: "Write down the name of one real person who you believe has this problem. Text them today asking if you can ask 3 questions about how they currently handle it. Do not mention your idea.",
        objective: "Replace assumption a1 with real behavioral evidence before committing any more time to building."
      },
      scenarios: {
        optimistic: { probability: 0.20, headline: "Validated insight → fundable MVP in 60 days", key_conditions: ["User interviews reveal strong, specific pain", "Willingness-to-pay conversations yield concrete numbers above cost"], impact_score: 8, estimated_timeline: "60 days to MVP" },
        neutral:    { probability: 0.55, headline: "Real problem, unclear monetization path", key_conditions: ["Problem is confirmed but willingness-to-pay is weak", "MVP gains users but revenue model requires iteration"], impact_score: 4, estimated_timeline: "6–12 months" },
        pessimistic:{ probability: 0.25, headline: "Founder problem, not market problem — pivot needed", key_conditions: ["Interviews reveal no one else experiences this urgently", "Existing free tools are already good enough"], impact_score: 1, estimated_timeline: "Never at this angle" }
      }
    }
  };
}
