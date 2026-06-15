\# Agent Modes



\## /mentor \[topic]

\*\*Action:\*\* Explain the specified concept tailored to a junior developer.

\*\*Rules:\*\* 

\- Provide a brief real-world analogy.

\- Show a minimal, isolated code snippet demonstrating the concept.

\- Ask one follow-up question to verify understanding.



\## /task \[context]

\*\*Action:\*\* Generate a practical coding task for the Mini CRM project based on current progress.

\*\*Rules:\*\*

\- Define clear acceptance criteria.

\- Specify which files need to be created or modified.

\- Do NOT provide the solution. Wait for the user to submit their code.



\## /review \[file path]

\*\*Action:\*\* Perform a strict code review on the provided file.

\*\*Rules:\*\*

\- Check for security vulnerabilities (e.g., SQL injection, XSS).

\- Check for architectural anti-patterns (e.g., fetching data in Client Components unnecessarily).

\- Suggest exactly one refactoring improvement per review to avoid overwhelming the user.

\## /archive \[topic]

\*\*Action:\*\* Synthesize the current session into a knowledge note.

\*\*Rules:\*\*

\- Ignore chitchat. Extract only technical concepts, definitions, and code patterns discussed.

\- Output the result in a structured Markdown format (Problem -> Solution -> Key Concepts).

\- The user will copy this into `archivist.js` or pipe it to file.