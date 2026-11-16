// Source for data/business-management.json
const tw = (head, rows) => `<div class="tablewrap"><table><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
const std = `<p class="muted" style="font-size:13px">Written from standard management theory. Your Week 1–2 slides are PDFs, so check these terms against them.</p>`;

const notes = {
mgr: `${std}
<p><span class="k">Management</span> is getting things done efficiently and effectively through and with other people.</p>
<ul><li><b>Efficiency</b> = doing things right: getting the most output from the least input (resources).</li><li><b>Effectiveness</b> = doing the right things: achieving the organisation's goals.</li></ul>
${tw(["Level", "Who", "Focus"], [["Top", "CEO, MD, directors", "Strategy, long-term direction"], ["Middle", "Department and regional managers", "Turning strategy into plans, managing managers"], ["First-line", "Supervisors, team leaders", "Day-to-day operations, front-line staff"]])}
<p><span class="k">Katz's three skills:</span> technical (most needed at first-line level), human (needed at every level), conceptual (most needed at top level).</p>
<p><span class="k">Functions</span> (from Fayol): Planning, Organising, Leading (commanding/directing), Coordinating, Controlling.</p>
<p><span class="k">Mintzberg's 10 roles</span> (from watching what managers actually do: brief, fragmented, varied work, not neat planning):</p>
${tw(["Group", "Roles"], [["Interpersonal", "Figurehead, Leader, Liaison"], ["Informational", "Monitor, Disseminator, Spokesperson"], ["Decisional", "Entrepreneur, Disturbance handler, Resource allocator, Negotiator"]])}
<p>Apply it to a real manager, e.g. Elliott Hill (Nike CEO, from intern to CEO): figurehead at launches, spokesperson to investors, entrepreneur in strategy shifts, disturbance handler when sales fall.</p>`,
classic: `
<p><span class="k">Why early theory emerged when it did:</span> the Industrial Revolution brought rapid industrialisation, large factories, mass standardised production and a big unskilled workforce. Work was inconsistent and rule-of-thumb, with no formal way to organise, supervise and control it. Managers needed efficiency and consistency.</p>
<p><span class="k">Taylor: scientific management</span> asked "how do we do each <i>task</i> most efficiently?" Time-and-motion study to find the one best way, standardised tools and methods, scientific selection and training of workers, piece-rate pay, and a split between managers (plan) and workers (do). Standardisation fixed inconsistency, so products got better.</p>
<p><span class="k">Fayol: administrative theory</span> asked "how do we organise the whole <i>organisation</i>?" He was an engineer who rose to MD of a French mining company and turned it from near-insolvency to excellent condition. His managerial functions are planning, organising, commanding, coordinating and controlling. Of the 14 principles, the top 6 are division of work, unity of command, scalar chain, unity of direction, authority and responsibility, and equity. The rest: discipline, subordination of individual interest, remuneration, centralisation, order, stability of tenure, initiative, esprit de corps.</p>
<p><span class="k">Weber: bureaucracy.</span> Clear hierarchy of authority, division of labour, written rules and procedures, impersonality, selection and promotion on merit and qualifications, careers, and records.</p>
<p><span class="k">Taylor vs Fayol at TUS:</span> Taylor would time how fast staff process a registration. Fayol would ask how admissions are planned, how departments are organised, and whether there's a clear line of command.</p>
<p><span class="k">Who benefits (exam favourite):</span> organisations that need consistency and efficiency, such as hotel chains, Revenue, telecom call centres, Ryanair, banks and Revolut. <span class="k">Who doesn't:</span> creative organisations like Electric Picnic, the Rose of Tralee or gaming studios, where rigid rules restrict flexibility and innovation and put creative people off.</p>
<p><span class="k">Criticisms:</span> treats workers like machines, ignores social and psychological needs, which led to the behavioural school (Mayo).</p>`,
motiv: `
<p><span class="k">Maslow's hierarchy</span> (bottom up): physiological (pay for food and shelter) → safety (job security, safe conditions, pension) → social (teams, belonging) → esteem (recognition, status, promotion) → self-actualisation (challenge, growth). A satisfied need no longer motivates, so managers must find the employee's current level.</p>
<p><span class="k">Mayo: the Hawthorne Studies</span> (Western Electric, Chicago, 1924–33) began the behavioural (human relations) school, 1920–45.</p>
<ul><li>Productivity rose whatever the lighting change. Workers responded to the <b>attention</b>: the <b>Hawthorne effect</b>.</li>
<li>Informal groups exert strong social control over work habits. Workers act as a group, not as individuals.</li>
<li>Recognition, security and belonging matter more to morale than physical conditions.</li>
<li>Money isn't the only motivator. Supervisors have significant influence on output.</li>
<li>Group collaboration must be planned and developed.</li></ul>
<p><span class="k">Herzberg's two-factor theory</span> (motivation-hygiene), influenced by Maslow. Interviews with workers, engineers and accountants found satisfaction and dissatisfaction aren't on one scale.</p>
${tw(["Hygiene factors (extrinsic)", "Motivators (intrinsic)"], [["Pay, job security, working conditions, company policy, supervision, relationships with colleagues", "Achievement, recognition, the work itself, responsibility, advancement, growth"], ["Absent → dissatisfaction. Present → no dissatisfaction, but NOT motivation", "Present → real motivation and satisfaction"]])}
<p>Fixing a hygiene problem (low pay, bad supervision) removes complaints but rarely creates drive. Hygiene factors have a ceiling. This is why some HR programmes don't work.</p>`,
env: `${std}
<p><span class="k">PESTEL</span> scans the external macro-environment: <b>P</b>olitical (government stability, trade policy, Brexit), <b>E</b>conomic (interest rates, inflation, unemployment, exchange rates), <b>S</b>ocial (demographics, lifestyle trends), <b>T</b>echnological (AI, automation, e-commerce), <b>E</b>nvironmental (climate, carbon tax, sustainability), <b>L</b>egal (employment law, GDPR, consumer law).</p>
<p><span class="k">Globalisation</span> is the growing integration of economies through trade, investment, technology and the movement of people. Drivers: technology, falling transport costs, trade agreements (EU single market), multinationals. Opportunities: bigger markets, cheaper inputs, economies of scale. Threats: global competition, supply-chain risk, exposure to shocks elsewhere. Ireland is a small open economy that depends heavily on FDI.</p>
<p><span class="k">SWOT</span>: Strengths and Weaknesses are <b>internal</b>. Opportunities and Threats are <b>external</b> (they often come from the PESTEL). Match strengths to opportunities, and fix the weaknesses that expose you to threats.</p>
<p><span class="k">Porter's five forces</span> (industry competitiveness): threat of new entrants, bargaining power of suppliers, bargaining power of buyers, threat of substitutes, and rivalry among existing competitors. Strong forces mean lower industry profitability.</p>
<p>Exam tip: apply every factor to the case company (Purcells in the case study). Generic lists score poorly.</p>`,
};

const topics = [
  { id: "mgr", name: "Managers and management", modes: ["cards", "drill", "written"], why: "Definitions, levels, skills and roles. Learn the lists, then practise applying them to a real manager.", notes: notes.mgr },
  { id: "classic", name: "Classical theory: Taylor, Fayol, Weber", modes: ["written", "cards", "drill"], why: "The sample exam question is on this. Practise the 'why then?' and 'which organisations benefit?' answers.", notes: notes.classic },
  { id: "motiv", name: "Motivation: Maslow, Mayo, Herzberg", modes: ["cards", "written", "drill"], why: "Three theories, each with findings to apply. Flashcards first, then exam answers.", notes: notes.motiv },
  { id: "env", name: "Business environment", modes: ["written", "cards"], why: "PESTEL, SWOT and five forces are frameworks you apply to a case. Practise writing, not just listing.", notes: notes.env },
];

const Q = (t, q, o, a, e) => ({ t, q, o, a, e });
const questions = [
  Q("mgr", "Efficiency means:", ["Doing the right things", "Doing things right: the most output from the least input", "Achieving goals at any cost", "Hiring more staff"], 1, "Effectiveness = doing the right things (achieving goals)."),
  Q("mgr", "Effectiveness means:", ["Minimising costs", "Achieving the organisation's goals", "Working faster", "Following rules"], 1, ""),
  Q("mgr", "Which skill matters MOST for top managers (Katz)?", ["Technical", "Conceptual", "Clerical", "Manual"], 1, "Technical matters most at first-line level. Human skills matter at every level."),
  Q("mgr", "A supervisor or team leader is a:", ["Top manager", "Middle manager", "First-line manager", "Non-manager"], 2, ""),
  Q("mgr", "Mintzberg's three groups of managerial roles:", ["Planning, organising, controlling", "Interpersonal, informational, decisional", "Technical, human, conceptual", "Top, middle, first-line"], 1, ""),
  Q("mgr", "A CEO cutting the ribbon at a new store opening is Mintzberg's:", ["Negotiator", "Figurehead", "Monitor", "Resource allocator"], 1, "Interpersonal role."),
  Q("mgr", "A manager dealing with a sudden strike is Mintzberg's:", ["Disturbance handler", "Entrepreneur", "Disseminator", "Liaison"], 0, "Decisional role."),
  Q("mgr", "Passing information from outside to staff inside is Mintzberg's:", ["Spokesperson", "Disseminator", "Monitor", "Figurehead"], 1, "Spokesperson passes information to outsiders."),
  Q("mgr", "Mintzberg found that managers' work is:", ["Neatly planned and reflective", "Brief, varied and fragmented", "Mostly paperwork", "Purely strategic"], 1, ""),
  Q("classic", "Early management theory developed mainly because of:", ["The internet", "Industrialisation, large factories and mass production", "Globalisation", "Trade unions"], 1, "A need for formal ways to organise, supervise and control work."),
  Q("classic", "Taylor's scientific management focused on:", ["The whole organisation's structure", "Finding the one best way to do each task", "Workers' social needs", "Strategy"], 1, "Time-and-motion study."),
  Q("classic", "Fayol's approach is known as:", ["Scientific management", "Administrative theory", "Bureaucracy", "Human relations"], 1, ""),
  Q("classic", "'Each employee should receive orders from one superior only' is Fayol's:", ["Scalar chain", "Unity of command", "Unity of direction", "Division of work"], 1, "The salesperson told 12% by marketing and 6% by finance breaks it."),
  Q("classic", "'A clear line of authority from top to bottom' is Fayol's:", ["Scalar chain", "Equity", "Centralisation", "Order"], 0, ""),
  Q("classic", "Which is NOT one of Fayol's management functions?", ["Planning", "Organising", "Motivating with piece rates", "Controlling"], 2, "Piece rates are Taylor. Fayol: plan, organise, command, coordinate, control."),
  Q("classic", "Weber's bureaucracy features:", ["Informal groups", "Clear hierarchy, written rules, impersonality, merit-based promotion", "Flexible roles", "Self-managed teams"], 1, ""),
  Q("classic", "Which organisation is LEAST suited to Taylorism?", ["A telecom call centre", "Ryanair", "A creative festival like Electric Picnic", "Revenue"], 2, "Rigid efficiency focus restricts creativity."),
  Q("classic", "A key criticism of classical theory is that it:", ["Was too focused on people", "Treated workers like machines and ignored social needs", "Had no principles", "Ignored efficiency"], 1, "This led to the behavioural school."),
  Q("motiv", "In Maslow's hierarchy, job security is a:", ["Physiological need", "Safety need", "Social need", "Esteem need"], 1, ""),
  Q("motiv", "The top of Maslow's hierarchy is:", ["Esteem", "Self-actualisation", "Social", "Safety"], 1, ""),
  Q("motiv", "Maslow argued that:", ["All needs motivate equally", "A satisfied need no longer motivates", "Money is the only motivator", "Needs have no order"], 1, ""),
  Q("motiv", "The Hawthorne Studies took place at:", ["Ford, Detroit", "Western Electric, Chicago", "Toyota, Japan", "General Motors"], 1, "1924–1933."),
  Q("motiv", "The Hawthorne effect is:", ["Productivity rising because workers feel observed and valued", "Pay increasing output", "Lighting improving output", "Fatigue lowering output"], 0, ""),
  Q("motiv", "A key finding of Mayo was that:", ["Money is the sole motivator", "Informal groups strongly influence worker behaviour", "Physical conditions matter most", "Supervisors have no effect"], 1, ""),
  Q("motiv", "Mayo's work began which school of thought?", ["Classical", "Behavioural (human relations)", "Quantitative", "Contingency"], 1, ""),
  Q("motiv", "In Herzberg's theory, salary is a:", ["Motivator", "Hygiene factor", "Self-actualisation need", "Esteem need"], 1, "Its absence causes dissatisfaction, but its presence doesn't motivate."),
  Q("motiv", "Which is a Herzberg MOTIVATOR?", ["Clean toilets", "Free parking", "Recognition and achievement", "Company policy"], 2, "Motivators are intrinsic."),
  Q("motiv", "Improving hygiene factors will:", ["Strongly motivate staff", "Remove dissatisfaction but not create motivation", "Have no effect at all", "Reduce productivity"], 1, ""),
  Q("motiv", "Intrinsic motivation comes from:", ["Rewards and punishments", "Within the person: the satisfaction of the work itself", "The manager", "Pay"], 1, ""),
  Q("env", "In SWOT, which are internal?", ["Opportunities and threats", "Strengths and weaknesses", "All four", "Threats only"], 1, ""),
  Q("env", "A rise in ECB interest rates is which PESTEL factor?", ["Political", "Economic", "Social", "Legal"], 1, ""),
  Q("env", "GDPR is which PESTEL factor?", ["Legal", "Technological", "Social", "Environmental"], 0, ""),
  Q("env", "Which is one of Porter's five forces?", ["Inflation", "Threat of substitutes", "Brand loyalty", "Interest rates"], 1, "New entrants, suppliers, buyers, substitutes, rivalry."),
  Q("env", "Globalisation means:", ["Firms only trading at home", "Growing integration of economies through trade, investment and technology", "Government ownership", "Higher tariffs"], 1, ""),
];

const C = (t, f, b) => ({ t, f, b });
const cards = [
  C("mgr", "Efficiency vs effectiveness", "Doing things right (least input per output) vs doing the right things (achieving goals)."),
  C("mgr", "Three levels of management", "Top (strategy) · middle (turn strategy into plans) · first-line (day-to-day, supervise staff)."),
  C("mgr", "Katz's three skills", "Technical (first-line), human (all levels), conceptual (top)."),
  C("mgr", "Management functions", "Planning, organising, leading/commanding, coordinating, controlling."),
  C("mgr", "Mintzberg: interpersonal roles", "Figurehead, leader, liaison."),
  C("mgr", "Mintzberg: informational roles", "Monitor, disseminator, spokesperson."),
  C("mgr", "Mintzberg: decisional roles", "Entrepreneur, disturbance handler, resource allocator, negotiator."),
  C("mgr", "Mintzberg's finding about managerial work", "Brief, fragmented and varied, not the neat planning of classical theory."),
  C("classic", "Why early management theory emerged", "Industrial Revolution: big factories, mass standardised production, large unskilled workforce, inconsistent work. A need to organise, supervise and control."),
  C("classic", "Taylor's key question", "How do we do each TASK most efficiently? (time-and-motion, one best way)"),
  C("classic", "Taylor's principles", "Scientific study of tasks, standardised methods and tools, scientific selection and training, piece-rate incentives, managers plan / workers do."),
  C("classic", "Fayol's key question", "How do we organise the WHOLE organisation so the tasks fit together?"),
  C("classic", "Fayol's top 6 principles", "Division of work, unity of command, scalar chain, unity of direction, authority and responsibility, equity."),
  C("classic", "Unity of command vs unity of direction", "One boss per employee vs one plan and leader per objective."),
  C("classic", "Weber's bureaucracy", "Hierarchy, division of labour, written rules, impersonality, merit-based selection and promotion, records."),
  C("classic", "Organisations that benefit from Taylorism", "Need consistency and efficiency: hotel chains, Revenue, call centres, Ryanair, banks, Revolut."),
  C("classic", "Organisations that DON'T benefit", "Creative ones (Electric Picnic, Rose of Tralee, gaming). Rigidity kills flexibility and innovation."),
  C("classic", "Main criticism of classical theory", "Treats people like machines and ignores social and psychological needs."),
  C("motiv", "Maslow's hierarchy (bottom to top)", "Physiological → safety → social → esteem → self-actualisation."),
  C("motiv", "Maslow at work: examples", "Pay (physiological), security/pension (safety), teams (social), recognition/promotion (esteem), challenge (self-actualisation)."),
  C("motiv", "Hawthorne Studies", "Elton Mayo, Western Electric, Chicago, 1924–33. The start of the behavioural school."),
  C("motiv", "Hawthorne effect", "Output rises because workers feel observed and valued, not because of physical changes."),
  C("motiv", "Mayo's findings (4)", "Informal groups control behaviour · belonging and recognition beat physical conditions · money isn't the only motivator · supervisors influence output."),
  C("motiv", "Herzberg's hygiene factors", "Pay, security, conditions, policy, supervision, co-worker relations. They prevent dissatisfaction but don't motivate."),
  C("motiv", "Herzberg's motivators", "Achievement, recognition, the work itself, responsibility, advancement, growth."),
  C("motiv", "Intrinsic vs extrinsic motivation", "From the satisfaction of the task itself vs from external rewards or avoiding punishment."),
  C("motiv", "Why some HR programmes fail (Herzberg)", "They improve hygiene factors (bonuses, parking) that only remove complaints. They don't add motivators."),
  C("env", "PESTEL", "Political, economic, social, technological, environmental, legal."),
  C("env", "SWOT", "Strengths and weaknesses (internal) · opportunities and threats (external)."),
  C("env", "Porter's five forces", "New entrants, supplier power, buyer power, substitutes, competitive rivalry."),
  C("env", "Globalisation: opportunities and threats", "Bigger markets, cheaper inputs, scale · global competition, supply-chain risk, external shocks."),
];

const W = (t, src, marks, q, points) => ({ t, src, marks, q, points });
const written = [
  W("mgr", "Week 2 slides (Managers & Management)", 15, "Using Mintzberg's managerial roles, analyse the work of a manager you know or have researched (e.g. Elliott Hill, CEO of Nike). Distinguish efficiency from effectiveness in your answer.", [
    "Mintzberg observed what managers actually do: brief, varied, fragmented work",
    "Interpersonal roles with examples: figurehead, leader, liaison",
    "Informational roles with examples: monitor, disseminator, spokesperson",
    "Decisional roles with examples: entrepreneur, disturbance handler, resource allocator, negotiator",
    "Efficiency (doing things right) vs effectiveness (doing the right things), linked to the manager's decisions",
    "Mention level of management and the skills needed (Katz: conceptual at the top)"]),
  W("classic", "Sample exam question (Moodle)", 10, "Explain why 'early management theory' developed when it did. Identify and explain two factors that created a need for more formal approaches to organising, supervising and controlling work.", [
    "Context: Industrial Revolution, rapid industrialisation, economic growth",
    "Factor 1: large factories and mass standardised production needed coordination",
    "Factor 2: large, often unskilled workforce needed supervision and training",
    "Work before was rule-of-thumb and inconsistent, so it was inefficient with poor quality",
    "Link each factor to the need to organise, supervise AND control"]),
  W("classic", "Sample exam question (Moodle)", 15, "Analyse how organisations could benefit from early management theory. Apply your answer to two contrasting types of organisation, and explain which organisations would benefit from this approach, giving reasons.", [
    "Benefits: efficiency, consistency, standardisation, clear structure and lines of authority",
    "Organisation 1 (benefits): e.g. Ryanair or a call centre needs standard, fast, repeatable processes",
    "Organisation 2 (contrasting, doesn't benefit): e.g. Electric Picnic or a games studio needs creativity and flexibility",
    "Name specific principles: Taylor's standardisation, Fayol's unity of command, scalar chain",
    "Conclusion: suits stable, high-volume, routine work, not innovation-driven work"]),
  W("classic", "Exam preparation slide (Week 4)", 15, "What was Taylor's contribution to management theory? Explain his principles and the problem each one solved.", [
    "Scientific study of tasks (time and motion) replaced rule-of-thumb",
    "Standardisation fixed inconsistency, so quality improved",
    "Scientific selection and training put the right worker on the right job",
    "Piece-rate incentive pay increased output",
    "Managers plan, workers execute: a clear division of responsibility",
    "Legacy: efficiency thinking in modern operations (fast food, logistics)"]),
  W("classic", "Week 4 slides", 15, "Distinguish between Taylor's scientific management and Fayol's administrative theory. Explain four of Fayol's principles with examples.", [
    "Taylor: task level, the efficiency of individual work · Fayol: the whole organisation and top managers",
    "TUS example: Taylor times registrations, Fayol designs departments and lines of command",
    "Division of work: specialisation (bank tellers vs loan officers)",
    "Unity of command: one boss (the 12% vs 6% discount conflict)",
    "Scalar chain: a clear line of authority from top to bottom",
    "Authority and responsibility: a foreman given a target needs the authority to draw materials"]),
  W("motiv", "Motivation slides", 15, "Explain Herzberg's two-factor theory and use it to advise a manager whose pay rise didn't improve staff motivation.", [
    "Two separate scales: satisfaction vs dissatisfaction",
    "Hygiene factors (pay, conditions, policy, supervision) prevent dissatisfaction only",
    "Motivators (achievement, recognition, responsibility, growth) create motivation",
    "A pay rise is hygiene: it removes complaints but doesn't create drive",
    "Advice: job enrichment, more responsibility, recognition schemes, progression pathways"]),
  W("motiv", "Motivation slides", 15, "Outline the findings of Elton Mayo's Hawthorne Studies and their importance for managers today.", [
    "Western Electric, Chicago, 1924–33, the start of the behavioural school",
    "Hawthorne effect: output rose because workers felt observed and valued",
    "Informal groups exert strong social control over work habits",
    "Recognition, belonging and security matter more than physical conditions, and money isn't the only motivator",
    "Today: teamwork, employee engagement, supervisors' influence, wellbeing initiatives"]),
  W("motiv", "Motivation slides", 10, "Explain Maslow's hierarchy of needs and how a manager could use it to motivate staff.", [
    "Five levels, bottom up: physiological, safety, social, esteem, self-actualisation",
    "Lower needs must be met first, and a satisfied need no longer motivates",
    "Workplace example for each level (pay, contract security, team events, recognition, challenging projects)",
    "Manager should identify where each employee is and target the next level",
    "Limitation: people differ, and needs aren't always in strict order"]),
  W("env", "Reading the Business Landscape (Purcells case)", 15, "Using PESTEL and SWOT, analyse the business environment of an Irish business of your choice.", [
    "PESTEL: at least one specific factor for each letter, applied to THAT business",
    "Distinguish internal (S, W) from external (O, T)",
    "Opportunities and threats drawn from the PESTEL findings",
    "Link: use strengths to exploit opportunities, address weaknesses exposed to threats",
    "A recommendation or conclusion for management"]),
];

module.exports = {
  slug: "business-management",
  topics, questions, cards, written,
  calc: [],
  info: {
    a2: `<p><b>Assessment 2 (20%), Mon 23 Nov.</b> Kelly hands out a <b>case study on Wed 18 Nov</b>, and the questions are based on the current class topic: <b>Reading the Business Landscape</b> (scanning the environment, globalisation, SWOT and industry competitive analysis, using the Purcells case study as the model).</p>
<ul><li class="todo">Wed 18 Nov: get the case. Read it twice the same evening and highlight every external factor.</li>
<li>Before Monday: run the case through PESTEL, then SWOT, then Porter's five forces. One page each, specific to that company.</li>
<li>Practise the "Business environment" exam question below, timed.</li>
<li>Re-read the Purcells case analysis on Moodle to see the structure Kelly expects.</li></ul>`,
  },
  tests: [
    { id: "a2", title: "Assessment 2: case study", date: "2026-11-23", when: "Mon 23 Nov · case given Wed 18 Nov", weight: "20%",
      format: "Case study questions on the current topic: Reading the Business Landscape", info: "a2",
      modes: ["info", "written", "cards", "notes"], topics: ["env"] },
    { id: "final", title: "Christmas exam", date: "2026-12-09", when: "Wed 9 Dec · 14:00–16:00", weight: "70%",
      format: "Written essay-style answers: explain, analyse and apply theory to real organisations",
      modes: ["written", "cards", "drill", "notes"] },
  ],
  sources: "Business Management Moodle: classical theory, Mayo and Herzberg slides, Taylorism exam-prep slide and the sample exam question. Week 1–3, Maslow and business-environment slides are PDFs, so those notes follow standard theory.",
};
