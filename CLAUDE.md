# Standard Chinese Platform Development Guide

## Project Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run lint` - Check formatting with Prettier

## Project Directory Structure
- `/src` - Application source code
  - `/app.html`, `/app.css` - Entry point files
  - `/lib` - Reusable components and utilities
    - `/components` - Svelte components
      - `/UI` - Shared UI components
      - `/rwp` - "Relevant World Practice" components
    - `/stores` - Svelte stores for state management
    - `/supabase` - Database client and utilities
  - `/routes` - SvelteKit page routes
    - `/api` - API endpoints
    - `/modules`, `/units` - Learning content routes
    - `/protected` - Authentication-protected routes
- `/static` - Static assets (fonts, images)
- `/supabase` - Database schema

## Code Style Guidelines
- **Formatting**: Use Prettier with provided configuration
- **Components**: Keep focused and single-purpose
- **CSS**: Use custom CSS in `<style>` blocks for complex components, Tailwind utilities for simple styling
- **Naming**: Follow BEM-like naming in custom CSS
- **Colors**: Use variables defined in style guide (terracotta, green, gold, navy, cream paper)
- **Typography**:
  - Headings: 'Arvo' or 'DM Serif Display'
  - Body: 'Work Sans'
  - Chinese: 'Noto Sans TC', 'Noto Sans SC'
- **Imports**: Group by type (Svelte, external libraries, internal modules)
- **Responsive**: Mobile-first approach using Tailwind's responsive prefixes
- **Animations**: Keep subtle (0.2s duration), use natural easing functions
- **Error Handling**: Use Toast component for user feedback

## Chinese Text Display
- Characters: Larger size (1.25em relative to English)
- Pinyin: Above characters, lighter color
- English: Regular size, below characters
- Support both simplified/traditional (fontPreferences store)

## Taped Chinese Learning Platform Project Description

I'm developing a web-based language learning platform that modernizes the Foreign Service Institute's "Standard Chinese: A Modular Approach" course materials. Built with SvelteKit, Tailwind CSS, and Supabase, this application digitizes textbook content and audio recordings from the comprehensive FSI course used to train diplomats. The content follows the original structure of 9 core modules, but I want it presented in an accessible, interactive format. Key features include toggling between simplified/traditional Chinese characters, integrated audio playback for dialogues and exercises, LLM integration for practice which incorporates learners context (Revelvant World Practice), and eventually user accounts to track progress. I'm prioritizing a clean, intuitive UI that allows users to navigate freely between modules. Being that this uses old tapes, the website has a cassette tape vintage aesthetic. As a solo developer learning fullstack development, I'm focusing on getting core feautures in and digitizing the content as an MVP, I want to make sure that this looks nice and cohesive. The platform will always maintain free access to the core FSI materials, with potential premium features like LLM-generated personalized exercises added later.
