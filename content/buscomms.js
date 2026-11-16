// Source for data/acct06080.json (Business Communication & Analysis)
const tw = (head, rows) => `<div class="tablewrap"><table><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;

const notes = {
process: `
<p><span class="k">The communication cycle:</span> Sender → <b>encoding</b> (turning the idea into words, symbols, gestures) → <b>message</b> → <b>channel</b> (medium) → receiver → <b>decoding</b> (interpreting the meaning) → <b>feedback</b> back to the sender. <b>Noise</b> can disrupt any stage.</p>
<p><span class="k">Principles of communication (Week 2):</span></p>
<ul>
<li>Communication is (often) <b>intentional, purposeful and consciously motivated</b>. <i>Reactive</i> communication makes small issues become big problems, and you spend more time fixing than building.</li>
<li><b>Intentional communication</b>: conveying messages with clarity, empathy and purpose, mindful of not just what is said but how, when and why. Effective communication builds teams, drives change and shapes culture. Towers Watson found companies with highly effective communication enjoy <b>47% higher total returns to shareholders</b>.</li>
<li>Communication is <b>inevitable</b>: you communicate even when you don't mean to (clothing, haircut, an expressionless face staring out the window).</li>
<li>Communication is <b>irreversible</b>: you can turn grapes into wine but not wine into grapes. Once you press send, it's impossible to take back.</li>
<li>Communication is <b>unrepeatable</b>: no exchange can be exactly recreated.</li>
<li>Communication <b>requires ethical choices</b>: freedom of speech doesn't mean you can say anything you please. Words can nurture or destroy, and can be weaponised. Plagiarism and harassment are examples.</li>
<li>Communication has <b>limitations</b>: it can't solve all interpersonal problems. Other skills are needed (flexibility, forgiveness, openness to change).</li></ul>
<p>Case used in class: Macklemore removed from Ed Sheeran's tour. The team stayed silent too long, and silence was "decoded" by the audience as outrage.</p>
<p><span class="k">Sending messages effectively (9):</span> be direct · own your message · be complete and specific · state your needs clearly · separate fact from opinion · focus on one thing at a time · deliver messages immediately · avoid hidden agendas · be supportive and consistent.</p>
<p><span class="k">The 7 Cs:</span> Completeness, Correctness, Conciseness, Courtesy, Clarity, Consideration, Concreteness (and coherence).</p>
<p><span class="k">How to practise intentional communication (12 steps):</span> 1 know your purpose (inform, persuade, entertain) · 2 understand your audience · 3 plan your message · 4 choose your words carefully (avoid jargon) · 5 be concise · 6 listen actively · 7 use the right tone · 8 ask for feedback (timely, accurate, actionable) · 9 be aware of non-verbal cues · 10 practise empathy · 11 be patient · 12 reflect and improve (Gibbs Reflective Cycle, 1988).</p>
<p><span class="k">Dialogic communication:</span> speaker and listener create meaning together. It's not a monologue, the speaker doesn't force beliefs on the audience, and both take an active role.</p>`,
barriers: `
<p>Barriers come from the <b>sender</b>, the <b>receiver</b> and <b>technology/transmission</b>.</p>
${tw(["Type", "What it is"], [
  ["Internal noise", "Inside sender and receiver: beliefs and values, faulty assumptions, trigger or 'hot button' words, defensiveness"],
  ["External noise", "Outside them: easier to control than internal noise; includes technology"],
  ["Semantic noise", "The receiver doesn't understand a word or gesture: different cultures, technicians using jargon with laypeople"],
  ["Gaps", "Differences between people: gender, age, ethnicity, race, status, sexual orientation, generation"],
  ["Sender barriers", "How much they know about the subject, indecision about how to present it, the order of presentation, unfamiliar audience, emotional conflict, lack of experience"],
  ["Receiver barriers", "Surroundings, physical condition, failure to pay attention (several messages at once, boredom), not understanding words, personal interests, emotional responses"],
  ["Transmission barriers", "Illegible material, poor acoustics, too many transmission links, conflicting messages"],
  ["Selective perception", "Hearing or seeing only what fits what you already believe or expect"]])}
<p><span class="k">Barriers to listening (4 categories):</span> internal distractions, external distractions, personal biases, conflicting demands.</p>
<p><span class="k">Factors that reduce listening skills:</span> the fast pace of everyday life, media training us to be passive listeners, commercials and "mini-messages", our own thoughts and feelings (daydreaming, anxiety, illness, fatigue), "scriptwriting" (planning what to say next), defensive listeners who prejudge, and cultural differences.</p>`,
listening: `
<p><b>Hearing is not listening.</b> "Hearing is with the ears, listening is with the mind."</p>
${tw(["Hearing", "Listening"], [["Accidental, involuntary, effortless", "Focused, voluntary, intentional"], ["A physical, passive process", "A mental and physical, active process. It needs concentration and leads to learning"]])}
<p>The average person understands only <b>30%</b> of what they hear. Employees and managers spend <b>42–63%</b> of their workday listening (Wolvin and Coakley, 1991), and listening is the most critical communication skill affecting organisational behaviour.</p>
<p><span class="k">Listening: 4 steps:</span> 1 Hear · 2 Interpret (decode) · 3 Understand (link to other concepts) · 4 Recall (remember).</p>
<p><span class="k">Stages of active listening (pyramid, bottom up):</span> S.O.L.E.R. body language → paraphrasing and asking questions → meaning and reflection → empathy → action.</p>
<div class="formula">SOLER = Sit squarely · Open posture · Lean slightly in · Eye contact (without staring) · Relax</div>
<p><span class="k">Active listening tips:</span> <b>Listen</b> (don't multitask or fake-listen) · <b>Feedback</b> (compassionate, constructive) · <b>Confirm</b> (repeat and paraphrase: "if I heard you correctly…") · <b>Ask</b> (a relevant follow-up question).</p>
<p><span class="k">Activity list:</span> read non-verbals, avoid distraction, apply the ideas, paraphrase, know your effect on the sender.</p>
<p><span class="k">Competent listeners</span> have more successful relationships, more professional success, solve problems better, are more engaged citizens, and learn from other speakers. Listening also matters in consumer behaviour (it shapes perceptions and purchase decisions) and in negotiation.</p>
<p><span class="k">Critical thinking</span> in listening means evaluating claims on well-supported reasons, evaluating evidence for accuracy and credibility, and watching for assumptions and biases. "Most people do not listen with the intent to understand; they listen with the intent to reply."</p>`,
ei: `
<p><span class="k">Goleman's 5 elements of emotional intelligence (EQ):</span> <b>self-awareness, self-regulation, motivation, empathy, social skills.</b></p>
${tw(["Low EI", "High EI"], [["'You always make me feel…'", "'I feel…'"], ["Can't share feelings verbally; negative feelings dominate", "Open expression of emotions; not preoccupied with negatives"], ["Not perceptive to others' feelings; carries grudges", "Identifies others' feelings; emotionally resilient"], ["Acts without reasoning; poor listener", "Decisions based on feelings and logic; good listener"], ["'Hits out' when there's a problem", "Talks about problems"]])}
<p>Higher EI in education: manages transitions better, less likely to drop out, higher qualifications, better career prospects.</p>
<p><span class="k">Self-awareness:</span> looking inward, thinking deeply about your behaviour, knowing your actions match your values. Personality tools: Big Five (OCEAN), Myers-Briggs (use with caution). Introverts are roughly 25–40% of people and recharge alone. Extroverts are 60–75% and are energised by others.</p>
<p><span class="k">Self-regulation:</span> managing your emotions and impulses. Zimmerman (2002) self-regulated learning: <b>planning → monitoring → reflection</b>.</p>
<p><span class="k">Motivation</span> (Latin <i>movere</i>, to move). <b>Intrinsic</b>: the activity is the reward. <b>Extrinsic</b>: to earn a reward or avoid punishment. Skinner's reinforcement theory and the law of effect: behaviour with positive consequences tends to be repeated. Maslow's hierarchy: only about 1 in 100 people become fully self-actualised.</p>
<p><span class="k">Empathy</span> is sensing others' emotions and imagining what they think or feel. Three types: <b>affective</b> (feeling what they feel), <b>somatic</b> (a physical reaction) and <b>cognitive</b> (understanding their thoughts). The <b>empathy trap</b> is being overwhelmed and neglecting your own needs.</p>`,
groups: `
<p>A <span class="k">team</span> is two or more people who interact to accomplish goals or meet needs. All teams are groups, but not all groups are teams: teams work more intensely together towards a specific, over-riding goal.</p>
<p>Teams contribute through <b>synergy</b> (performance enhancers), <b>responsiveness to customers</b> (cross-functional teams), <b>innovation</b> and as <b>motivators</b>. A <b>formal group</b> is set up by managers for organisational goals. An <b>informal group</b> is formed by employees for their own goals or needs. Team types: committee, problem-solving, project, creative, cross-functional.</p>
<p><span class="k">Large groups:</span> more resources, division of labour, more learning and diversity · but communication and coordination problems, lower motivation, trust and accountability.</p>
<p><span class="k">Effective teams:</span> synergy, shared purpose, clear and challenging goals, a diverse mix, the right size, psychological safety, team before individual, open and honest communication.</p>
<p><span class="k">Task interdependence:</span> <b>pooled</b> (separate contributions added together) · <b>sequential</b> (tasks in a set order, like writer then editor: clear but risks bottlenecks) · <b>reciprocal</b> (each depends fully on the others, like designer and developer: innovative but complex).</p>
<p><span class="k">Tuckman's stages:</span> <b>Forming</b> (getting to know each other; can be slowest) → <b>Storming</b> (conflict; has to happen to set rules) → <b>Norming</b> (close ties and consensus; dangerous, as biases solidify) → <b>Performing</b> (real work; sometimes never reached) → <b>Adjourning</b> (temporary groups disband).</p>
<p><span class="k">Norms</span> are shared rules most members follow. Members <b>conform</b> to get rewards, imitate respected members, or because it feels right. A <b>deviant</b> is pressured to conform, expelled, or the norms change. <b>Cohesiveness</b> is measured by participation, conformity and emphasis on group goals. A balance of conformity and deviance is healthy.</p>
<p><span class="k">Groupthink</span> is "a process of flawed decision making that occurs as a result of strong pressures among group members to reach an agreement" (Gruman, Schneider and Coutts, 2017). <b>Challenger, 28 Jan 1986</b>: the O-rings only worked above 53°F, and it was 36°F at launch. National, political and media pressure (Reagan's State of the Union that night) pushed the launch through. <b>To counteract it:</b> assign a critical evaluator, have trusted outsiders scrutinise decisions, hold meetings for raising misgivings, split into subgroups, and listen to dissenting views.</p>
<p><span class="k">Social loafing</span> is putting in less effort in a group than alone. <b>Ringelmann (1913)</b> rope-pulling: people pulled less in groups, and the 1974 replication showed it's motivational, not coordination. Causes: low motivation, <b>diffusion of responsibility</b> (like the bystander effect), group size, and expectations that others will slack. Fix it by making individual contributions identifiable, keeping groups small, valuing every contribution, and rewarding both individual and group performance.</p>
<p><span class="k">Social facilitation:</span> the presence of others (real, implied or imagined) improves performance. <b>Co-action effect</b>: others doing the same task. <b>Audience effect</b>: performing in front of others. Influenced by physiological, cognitive and affective factors.</p>
<p><span class="k">Belbin's team roles</span> (linked on Moodle): Plant, Resource Investigator, Co-ordinator, Shaper, Monitor Evaluator, Teamworker, Implementer, Completer Finisher, Specialist.</p>`,
writing: `
<p class="muted" style="font-size:13px">The Academic Writing lectures are on 17 and 20 Nov and their slides aren't on Moodle yet. These are standard points. Add your own notes from the lectures.</p>
<ul><li><b>Harvard referencing</b>: in-text (Author, Year) or Author (Year), e.g. (Wolvin and Coakley, 1991). A full reference list at the end, alphabetical by author.</li>
<li>Academic tone: formal, objective, third person, no contractions or slang.</li>
<li>Structure: introduction (what you'll argue) → body paragraphs (one point each, with evidence) → conclusion (no new information).</li>
<li>Paraphrase in your own words and still cite it. Direct quotes go in quotation marks with a page number.</li>
<li>Use credible sources: TUS Library and Google Scholar (from the Week 2 slides).</li>
<li>Plagiarism is an ethical issue: communication requires ethical choices.</li></ul>
<p><span class="k">Presentation skills</span> (also fair game): THINK and plan (aim: inform, persuade or request · audience · context · likely reaction). Voice: project from the diaphragm, a strong voice not a loud one, vary pace, pitch, inflection, emphasis and pause, and avoid inaudibility (clenched teeth). Over 50% of communication is non-verbal, and <b>congruence</b> means your body language must match your words. On the day: be early, don't sway or chew gum, keep your hands visible, and clarify a question before answering.</p>`,
};

const topics = [
  { id: "process", name: "Communication process and principles", modes: ["cards", "drill"], why: "Lots of named lists (principles, 7 Cs, the 9 sending rules). Flashcards first, then test yourself.", notes: notes.process },
  { id: "barriers", name: "Communication barriers", modes: ["cards", "drill"], why: "Know each barrier type and an example. Questions will give a scenario and ask which barrier it is.", notes: notes.barriers },
  { id: "listening", name: "Active listening", modes: ["cards", "drill"], why: "SOLER, the 4 steps, hearing vs listening and the pyramid: definition questions.", notes: notes.listening },
  { id: "ei", name: "Emotional intelligence", modes: ["cards", "drill"], why: "Goleman's 5 elements, the types of empathy and intrinsic vs extrinsic motivation.", notes: notes.ei },
  { id: "groups", name: "Group theory and team dynamics", modes: ["drill", "cards"], why: "The biggest slide deck: Tuckman, groupthink (Challenger) and social loafing (Ringelmann).", notes: notes.groups },
  { id: "writing", name: "Academic writing and presentation skills", modes: ["notes", "cards"], why: "The Academic Writing lectures are this week. Add your own notes from them.", notes: notes.writing },
];

const Q = (t, q, o, a, e) => ({ t, q, o, a, e });
const questions = [
  Q("process", "Turning an idea into words, symbols or gestures is called:", ["Decoding", "Encoding", "Feedback", "Noise"], 1, "The receiver decodes it."),
  Q("process", "The receiver interpreting the meaning of a message is:", ["Encoding", "Decoding", "The channel", "Noise"], 1, ""),
  Q("process", "Anything that disrupts the message at any stage of the cycle is:", ["Feedback", "Noise", "The channel", "Encoding"], 1, ""),
  Q("process", "The medium a message travels through (email, phone, face to face) is the:", ["Channel", "Code", "Noise", "Feedback"], 0, ""),
  Q("process", "'You can turn grapes into wine but not wine into grapes' illustrates that communication is:", ["Inevitable", "Irreversible", "Unrepeatable", "Intentional"], 1, "Once you press send it's impossible to take back."),
  Q("process", "A student staring out the window with a blank face is still communicating. This shows communication is:", ["Irreversible", "Inevitable", "Ethical", "Unrepeatable"], 1, "You communicate even when you don't intend to."),
  Q("process", "Reactive communication tends to:", ["Build relationships", "Make small issues become big problems", "Save time", "Improve clarity"], 1, "You spend more time fixing than building."),
  Q("process", "Towers Watson found companies with highly effective communication enjoy:", ["10% lower costs", "47% higher total returns to shareholders", "Double the staff retention", "30% more sales"], 1, ""),
  Q("process", "Which is NOT one of the 7 Cs?", ["Clarity", "Courtesy", "Creativity", "Conciseness"], 2, "Completeness, correctness, conciseness, courtesy, clarity, consideration, concreteness."),
  Q("process", "'Separate fact from opinion' and 'avoid hidden agendas' are rules for:", ["Receiving messages", "Sending messages effectively", "Active listening", "Non-verbal communication"], 1, "From the 9 rules for sending messages effectively."),
  Q("process", "In dialogic communication:", ["The speaker delivers a monologue", "Speaker and listener create meaning together", "Only the receiver is active", "Feedback is avoided"], 1, ""),
  Q("process", "'Freedom of speech doesn't mean you can say anything you please' relates to which principle?", ["Communication is irreversible", "Communication requires ethical choices", "Communication is inevitable", "Communication has limitations"], 1, ""),
  Q("process", "'Communication cannot solve all interpersonal problems' illustrates that communication:", ["Is irreversible", "Has limitations", "Is unrepeatable", "Is inevitable"], 1, ""),
  Q("process", "The first step in practising intentional communication is to:", ["Choose your words", "Know your purpose", "Ask for feedback", "Be patient"], 1, "Inform, persuade or entertain."),
  Q("process", "Great feedback is timely, accurate and:", ["Long", "Actionable", "Anonymous", "Positive only"], 1, ""),
  Q("process", "The reflective cycle on the 'reflect and improve' slide is by:", ["Goleman", "Gibbs (1988)", "Tuckman", "Maslow"], 1, ""),
  Q("barriers", "A technician using jargon with a customer who doesn't understand it is:", ["External noise", "Semantic noise", "A transmission barrier", "Selective perception"], 1, "The receiver doesn't understand a word or gesture."),
  Q("barriers", "Faulty assumptions, defensiveness and 'hot button' words are:", ["External noise", "Internal noise", "Transmission barriers", "Gaps"], 1, "They occur inside the sender and receiver."),
  Q("barriers", "Compared with internal noise, external noise is:", ["Harder to control", "Easier to control", "The same", "Always technological"], 1, ""),
  Q("barriers", "Poor acoustics and illegible handwriting are:", ["Receiver barriers", "Transmission barriers", "Semantic noise", "Gaps"], 1, ""),
  Q("barriers", "Differences in age, gender, status or generation between people are called:", ["Gaps", "Semantic noise", "Selective perception", "Transmission barriers"], 0, ""),
  Q("barriers", "Hearing only what fits what you already believe is:", ["Selective perception", "Scriptwriting", "Semantic noise", "Groupthink"], 0, ""),
  Q("barriers", "The four categories of barriers to listening are internal distractions, external distractions, personal biases and:", ["Poor acoustics", "Conflicting demands", "Jargon", "Low EI"], 1, ""),
  Q("barriers", "'Scriptwriting' as a listening problem means:", ["Writing notes while listening", "Being too busy planning what you'll say next to listen", "Reading from a script", "Paraphrasing"], 1, ""),
  Q("barriers", "Lack of familiarity with the audience and emotional conflict are barriers caused by the:", ["Receiver", "Sender", "Channel", "Technology"], 1, ""),
  Q("listening", "Which describes HEARING rather than listening?", ["Focused", "Voluntary", "Accidental and effortless", "Intentional"], 2, "Listening is focused, voluntary and intentional."),
  Q("listening", "On average, a person understands roughly what share of what they hear?", ["10%", "30%", "60%", "90%"], 1, ""),
  Q("listening", "Employees and managers spend roughly what share of their workday listening (Wolvin and Coakley, 1991)?", ["10–20%", "42–63%", "70–85%", "5%"], 1, ""),
  Q("listening", "SOLER stands for:", ["Speak, Observe, Listen, Engage, Respond", "Sit squarely, Open posture, Lean in, Eye contact, Relax", "Summarise, Organise, Listen, Evaluate, Reflect", "Smile, Open, Look, Empathise, Repeat"], 1, ""),
  Q("listening", "SOLER is the base of the active listening pyramid. What is at the top?", ["Empathy", "Action", "Paraphrasing", "Meaning and reflection"], 1, "SOLER → paraphrase and ask → meaning and reflection → empathy → action."),
  Q("listening", "The 4 steps of listening are hear, interpret, understand and:", ["Respond", "Recall", "Reply", "Reflect"], 1, ""),
  Q("listening", "'If I heard you correctly, you want me to…' is which active listening tip?", ["Listen", "Feedback", "Confirm", "Ask"], 2, "Confirm by repeating and paraphrasing."),
  Q("listening", "'Hearing is with the ears…'", ["…listening is with the eyes", "…listening is with the mind", "…listening is with the heart", "…listening is optional"], 1, ""),
  Q("listening", "Most people listen with the intent to:", ["Understand", "Reply", "Learn", "Remember"], 1, "From the critical thinking slide."),
  Q("ei", "Goleman's five elements of EI are self-awareness, self-regulation, motivation, empathy and:", ["Intelligence", "Social skills", "Confidence", "Resilience"], 1, ""),
  Q("ei", "Saying 'I feel…' rather than 'You always make me feel…' shows:", ["Low EI", "High EI", "Social loafing", "Groupthink"], 1, ""),
  Q("ei", "Zimmerman's (2002) self-regulated learning stages are:", ["Plan, do, review", "Planning, monitoring, reflection", "Forming, storming, norming", "Hear, interpret, recall"], 1, ""),
  Q("ei", "Doing an activity because it's enjoyable in itself is:", ["Extrinsic motivation", "Intrinsic motivation", "Reinforcement", "Self-regulation"], 1, ""),
  Q("ei", "Reinforcement theory and the 'law of effect' are associated with:", ["Maslow", "B.F. Skinner", "Goleman", "Tuckman"], 1, "Behaviour with positive consequences tends to be repeated."),
  Q("ei", "Physically feeling another person's emotion (e.g. wincing at their pain) is:", ["Cognitive empathy", "Affective empathy", "Somatic empathy", "Sympathy"], 2, "Cognitive = understanding their thoughts. Affective = feeling what they feel."),
  Q("ei", "The 'empathy trap' is:", ["Lacking empathy", "Being overwhelmed by others' feelings and neglecting your own", "Faking empathy", "Only empathising with friends"], 1, ""),
  Q("ei", "Roughly what share of the population are introverts?", ["5–10%", "25–40%", "60–75%", "90%"], 1, "Extroverts are about 60–75%."),
  Q("ei", "'Motivation' comes from the Latin 'movere', meaning:", ["To want", "To move", "To need", "To work"], 1, ""),
  Q("groups", "What distinguishes a team from a group?", ["Size", "Intensity of working together and a specific over-riding goal", "Having a leader", "Meeting in person"], 1, "All teams are groups, but not all groups are teams."),
  Q("groups", "People working together producing more than they would separately is:", ["Social loafing", "Synergy", "Groupthink", "Conformity"], 1, ""),
  Q("groups", "A group set up by managers to achieve organisational goals is a:", ["Formal group", "Informal group", "Friendship group", "Interest group"], 0, ""),
  Q("groups", "Tuckman's stages in order:", ["Forming, norming, storming, performing, adjourning", "Forming, storming, norming, performing, adjourning", "Storming, forming, norming, performing", "Norming, forming, storming, performing"], 1, ""),
  Q("groups", "Which stage involves conflict, and has to happen to set group rules?", ["Forming", "Storming", "Norming", "Adjourning"], 1, ""),
  Q("groups", "Which stage is described as 'dangerous' because biases can solidify?", ["Forming", "Storming", "Norming", "Performing"], 2, ""),
  Q("groups", "Adjourning applies to:", ["All groups", "Temporary groups and task forces that disband", "Only failed groups", "Informal groups"], 1, ""),
  Q("groups", "A writer waiting for an editor before publishing is an example of:", ["Pooled interdependence", "Sequential interdependence", "Reciprocal interdependence", "Social loafing"], 1, ""),
  Q("groups", "A designer and developer fully dependent on each other's work is:", ["Pooled", "Sequential", "Reciprocal", "Independent"], 2, ""),
  Q("groups", "Groupthink is:", ["Brainstorming", "Flawed decision making caused by strong pressure to reach agreement", "Social loafing", "Group cohesiveness"], 1, "Gruman, Schneider and Coutts (2017)."),
  Q("groups", "The Challenger disaster (1986) is used as an example of:", ["Social loafing", "Groupthink", "Synergy", "Social facilitation"], 1, "Known O-ring risk below 53°F, launched at 36°F under pressure."),
  Q("groups", "Which helps PREVENT groupthink?", ["A strong dominant leader", "Assigning a critical evaluator and listening to dissent", "Faster decisions", "Larger groups"], 1, "Also outside scrutiny, subgroups and meetings for misgivings."),
  Q("groups", "Social loafing is:", ["Working harder in groups", "Putting in less effort in a group than individually", "Taking breaks", "Group conflict"], 1, ""),
  Q("groups", "Ringelmann's rope-pulling experiment (1913) showed:", ["People pull harder in groups", "People make less effort in groups", "Leaders matter", "Size doesn't matter"], 1, "The 1974 replication showed the cause is motivational."),
  Q("groups", "'Someone else will do it', a cause of social loafing, is:", ["Diffusion of responsibility", "Selective perception", "Conformity", "Synergy"], 0, "Similar to the bystander effect."),
  Q("groups", "Performance improving because others are present is:", ["Social loafing", "Social facilitation", "Groupthink", "Norming"], 1, "Co-action effect and audience effect."),
  Q("groups", "Group cohesiveness is measured by participation, conformity to norms and:", ["Group size", "Emphasis on group goal accomplishment", "Salary", "Number of meetings"], 1, ""),
  Q("groups", "A disadvantage of LARGE groups is:", ["More resources", "Division of labour", "Communication and coordination problems", "More diversity"], 2, ""),
  Q("writing", "Congruence in presentations means:", ["Speaking loudly", "Your body language matches your words", "Using many slides", "Reading from notes"], 1, ""),
  Q("writing", "Effective voice projection comes from:", ["The throat", "The diaphragm", "Speaking faster", "Shouting"], 1, "A strong voice, not a loud voice."),
  Q("writing", "Inaudibility is often caused by:", ["Speaking too slowly", "Speaking through clenched teeth with little lip movement", "Pausing", "Varying pitch"], 1, ""),
  Q("writing", "Harvard in-text referencing looks like:", ["[1]", "(Wolvin and Coakley, 1991)", "Footnote only", "ibid."], 1, ""),
];

const C = (t, f, b) => ({ t, f, b });
const cards = [
  C("process", "Communication cycle", "Sender → encoding → message → channel → receiver → decoding → feedback. Noise can disrupt any stage."),
  C("process", "Encoding vs decoding", "Turning the idea into a message vs interpreting the message's meaning."),
  C("process", "Communication principles", "Intentional/purposeful (often) · inevitable · irreversible · unrepeatable · requires ethical choices · has limitations."),
  C("process", "Reactive communication", "Small issues become big problems, and you spend more time fixing than building."),
  C("process", "Intentional communication", "Messages with clarity, empathy and purpose. Mindful of what, how, when and why."),
  C("process", "9 rules for sending messages", "Be direct · own your message · complete and specific · state needs clearly · fact vs opinion · one thing at a time · deliver immediately · no hidden agendas · supportive and consistent."),
  C("process", "7 Cs", "Completeness, correctness, conciseness, courtesy, clarity, consideration, concreteness."),
  C("process", "12 steps of intentional communication", "Purpose, audience, plan, words, concise, listen, tone, feedback, non-verbal, empathy, patience, reflect."),
  C("process", "Dialogic communication", "Speaker and listener create meaning together. Not a monologue."),
  C("barriers", "Internal vs external noise", "Inside sender/receiver (beliefs, assumptions, hot-button words, defensiveness) vs outside (environment, technology; easier to control)."),
  C("barriers", "Semantic noise", "The receiver doesn't understand a word or gesture: jargon, cultural differences."),
  C("barriers", "Gaps", "Differences between people: gender, age, ethnicity, status, generation."),
  C("barriers", "Transmission barriers", "Illegible material, poor acoustics, too many links, conflicting messages."),
  C("barriers", "Barriers to listening (4)", "Internal distractions, external distractions, personal biases, conflicting demands."),
  C("barriers", "Selective perception", "Noticing only what fits your existing beliefs or expectations."),
  C("listening", "Hearing vs listening", "Accidental, involuntary, effortless vs focused, voluntary, intentional."),
  C("listening", "SOLER", "Sit squarely, Open posture, Lean slightly in, Eye contact, Relax."),
  C("listening", "Active listening pyramid (bottom up)", "SOLER → paraphrasing and asking questions → meaning and reflection → empathy → action."),
  C("listening", "Listening: 4 steps", "Hear, interpret (decode), understand (link), recall."),
  C("listening", "Active listening tips", "Listen · Feedback · Confirm (paraphrase) · Ask."),
  C("listening", "Key listening stats", "We understand ~30% of what we hear. 42–63% of the workday is spent listening (Wolvin and Coakley, 1991)."),
  C("ei", "Goleman's 5 elements of EI", "Self-awareness, self-regulation, motivation, empathy, social skills."),
  C("ei", "High EI behaviours", "'I feel…', emotionally resilient, good listener, talks about problems, decisions on feelings + logic."),
  C("ei", "Zimmerman's self-regulated learning", "Planning → monitoring → reflection."),
  C("ei", "Intrinsic vs extrinsic motivation", "The activity is the reward vs to earn a reward or avoid punishment."),
  C("ei", "Three types of empathy", "Affective (feel it), somatic (physical reaction), cognitive (understand their thinking)."),
  C("ei", "Skinner's law of effect", "Behaviour with positive consequences tends to be repeated."),
  C("groups", "Team vs group", "Teams work intensely towards a specific over-riding goal. All teams are groups, not all groups are teams."),
  C("groups", "Tuckman's stages", "Forming, storming, norming, performing, adjourning."),
  C("groups", "Pooled / sequential / reciprocal", "Contributions added · set order (writer → editor) · fully dependent (designer ↔ developer)."),
  C("groups", "Groupthink", "Flawed decision making from strong pressure to agree (Gruman et al., 2017). Example: Challenger, 1986."),
  C("groups", "Preventing groupthink", "Critical evaluator, outside scrutiny, meetings for misgivings, subgroups, listen to dissent."),
  C("groups", "Social loafing", "Less effort in a group than alone. Ringelmann (1913). Causes: low motivation, diffusion of responsibility, size, expectations."),
  C("groups", "Social facilitation", "Others' presence improves performance: co-action effect and audience effect."),
  C("groups", "Effective team characteristics", "Synergy, shared purpose, clear goals, diverse mix, right size, psychological safety, open communication."),
  C("groups", "Formal vs informal group", "Set up by managers for organisational goals vs formed by employees for their own needs."),
  C("writing", "Congruence", "Non-verbal communication matches your words."),
  C("writing", "Vocal variety", "Pace, volume, pitch/inflection/emphasis, pause."),
  C("writing", "Harvard referencing", "(Author, Year) in text, plus a full alphabetical reference list."),
];

const info = {
  presentation: `
<p><b>Group presentation (20%).</b> Analyse one effective communicator (ideally someone niche) using module theory: communication principles, active listening, non-verbal communication, EI.</p>
<ul>
<li class="todo"><b>Tue 17 Nov lecture:</b> tell Kelly which date and time slot your group wants. Each lab hour only fits 3–4 groups.</li>
<li><b>Slots left on Moodle:</b> Tue 17 Nov 4–6pm (1A12) · Wed 18 Nov 11am–1pm (8A107) and 4–6pm (1A12) · Thu 19 Nov 11am–1pm (1A17) and 2–4pm (1A13) · Tue 24 Nov 4–6pm (1A12) · Wed 25 Nov 11am–1pm (8A107) and 4–6pm (1A12) · Thu 26 Nov 11am–1pm (1A17). Thu 26 Nov 2–3pm is fully booked.</li>
<li><b>Submission (changed 13 Nov):</b> the group leader shares the PowerPoint with kelly.browne@tus.ie via OneDrive <b>before 9am on the morning</b> of your presentation, with editing rights.</li>
<li>File name: every member's name, e.g. <i>Tomdunne_Marysheehy_Karenfoley_BusComsAssessment2.pptx</i>. Incorrectly named files are rejected. Names also go on the opening slide.</li>
<li>Maximum <b>8 slides</b>, including title, activity, conclusion and reference slides. Use Harvard referencing.</li>
<li>Include an <b>audience activity</b> and a <b>2-minute Q&amp;A</b> answered as a group.</li>
<li>Everyone must be present and deliver part of it to get the team mark. Check the rubric on Moodle for how delivery is marked.</li></ul>`,
  gmetrix: `
<p><b>GMetrix PowerPoint test (20%)</b>, sat in the labs during the 10–19 Nov window. It's an IT skills test, so practise in GMetrix itself (Training mode, then Testing mode). Kelly's GMetrix access code is on the Business Comms announcements page.</p>
<p>If you haven't sat it yet, Thursday 19 Nov is the last day of the window.</p>`,
};

module.exports = {
  slug: "acct06080",
  topics, questions, cards, written: [], calc: [], info,
  tests: [
    { id: "gmetrix", title: "GMetrix PowerPoint test", date: "2026-11-19", when: "Window 10–19 Nov · labs", weight: "20%",
      format: "IT skills test on GMetrix, in the labs", modes: ["info"], info: "gmetrix" },
    { id: "presentation", title: "Group presentation", date: "2026-11-17", when: "17–26 Nov · book your slot Tue 17", until: "2026-11-26", weight: "20%",
      format: "Groups of 2–4 · max 8 slides · audience activity + 2-min Q&A", modes: ["info"], info: "presentation" },
    { id: "quiz", title: "End-of-year in-class exam", date: "2026-11-24", when: "Tue 24 Nov · in class", weight: "30%",
      format: "In class, on lecture topics: communication process, principles, barriers, active listening, EI, group theory, team dynamics, academic writing",
      modes: ["drill", "cards", "notes"] },
  ],
  sources: "Business Comms & Analysis Moodle: November schedule, End of Year Test Topics list, Emotional Intelligence, Group Team Theory, Presentation Do's and Don'ts and Communication Principles slides, the group presentation brief, and Kelly's announcements.",
};
