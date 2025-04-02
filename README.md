# Standard Chinese Platform

A modern web-based language learning platform that digitizes and enhances the Foreign Service Institute's "Standard Chinese: A Modular Approach" course materials with a vintage cassette tape aesthetic.

## Overview

Standard Chinese Platform transforms the comprehensive FSI course (originally used to train diplomats) into an accessible, interactive format for modern learners. The platform preserves the original 9-module structure while adding interactive features and a user-friendly interface.

## Key Features

- **Toggle Between Chinese Character Sets**: Switch between simplified and traditional Chinese character display
- **Integrated Audio Playback**: Listen to authentic dialogues and exercises with a vintage cassette tape interface
- **Relevant World Practice (RWP)**: AI-powered personalized learning exercises that adapt content to your real-world context, job, hobbies, and interests
- **Comprehensive Learning Structure**: 
  - 9 core modules following the original FSI curriculum
  - Multiple units per module with vocabulary, dialogues, and exercises
  - Interactive flashcard decks for vocabulary practice
- **Vintage Aesthetic**: Cassette tape UI elements and paper textures create a nostalgic learning environment
- **Mobile-Responsive Design**: Learn on any device with a fully responsive interface

## Relevant World Practice (RWP)

RWP is our innovative approach to language learning that creates personalized content based on your profile information:

1. **Analyzes Unit Content**: Extracts key vocabulary and grammar patterns from the unit you're studying
2. **Connects to Your Context**: Uses your profile information and learning goals to create personalized scenarios
3. **Generates Custom Content**: Creates first-person narrative stories with comprehension questions that use unit vocabulary in contexts meaningful to you

This approach makes learning more engaging by allowing you to practice Chinese in situations relevant to your life, rather than generic textbook scenarios.

## Technology Stack

- **Frontend**: SvelteKit 2.16.0, Svelte 5.0.0
- **Styling**: Tailwind CSS 4.0.0
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Payments**: Stripe 17.7.0 (for premium features)
- **AI Integration**: LLM for personalized content generation
- **Deployment**: Vercel

## Free Access Commitment

The Standard Chinese Platform is committed to maintaining free access to the core FSI course materials. Premium features like enhanced RWP access may be offered as optional paid upgrades.

## Development Status

This platform is actively under development, with a focus on digitizing content and implementing core features. As a solo developer project, new features and improvements are added incrementally.