# Reflection: AI’s Impact on Building Pollify

## How AI Shaped My Development Process

Throughout the development of Pollify, a suite of AI tools played a transformative role in shaping both my workflow and the final product. I used GitHub Copilot, Cursor, Zed, Coderabbit, and Google Gemini (via API keys) at different stages of the build. Each tool contributed unique strengths, accelerating development and improving code quality.

GitHub Copilot’s contextual code suggestions were invaluable for scaffolding new features, reducing boilerplate, and maintaining consistency. Cursor and Zed provided smart code navigation, refactoring, and inline AI chat, which helped clarify requirements and debug issues faster. Coderabbit offered conversational assistance and code reviews, while Google Gemini’s API enabled advanced code generation and documentation drafting.

## What Worked Well

Copilot excelled at generating repetitive code, such as form components, type definitions, and CRUD logic for database operations. Cursor and Zed made it easy to refactor and explore the codebase, while Coderabbit’s review suggestions improved code reliability. Gemini’s API was especially helpful for generating documentation and handling complex logic, and its generous free API keys made experimentation and integration seamless and cost-effective.

## Limitations and Challenges

Despite their strengths, these AI tools occasionally produced generic or incomplete code, especially for edge cases or complex business logic. Prompt specificity was crucial—clear, detailed comments led to better suggestions. Reviewing and iterating on AI-generated code was essential to ensure security, correctness, and maintainability. For instance, Copilot and Gemini sometimes missed subtle details in Supabase queries or Next.js routing, requiring manual intervention. Cursor and Zed’s navigation features were powerful but sometimes struggled with large, deeply nested projects.

## Lessons Learned

The experience reinforced the importance of human oversight in AI-assisted development. While these tools accelerated the initial build, careful review and testing were necessary to catch errors and optimize performance. Iterative prompting—refining instructions and code in small steps—yielded the best results. The process also highlighted the value of modular design, as AI tools were most effective when working within well-structured, type-safe files.

## Final Thoughts

AI tools like Copilot, Cursor, Zed, Coderabbit, and Gemini are invaluable for modern web development, enabling rapid prototyping and reducing cognitive load. However, they are not a substitute for thoughtful design, thorough testing, and domain expertise. Pollify’s build process was a collaborative effort between human creativity and a diverse set of AI assistants, resulting in a robust, maintainable, and user-friendly polling application.