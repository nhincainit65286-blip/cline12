/**
 * QuestionFlowEngine
 * Generates intelligent questions to understand user's goals
 */
export interface Question {
	id: string
	text: string
	type: "text" | "choice" | "multiChoice"
	options?: string[]
	required: boolean
}

export interface Answer {
	questionId: string
	value: string | string[]
}

export class QuestionFlowEngine {
	private maxQuestions = 7
	private askedQuestions: Set<string> = new Set()

	/**
	 * Generate questions based on context
	 */
	generateQuestions(context: { goal?: string; codebase?: string }): Question[] {
		const questions: Question[] = []

		// Question 1: What are you trying to build?
		if (!this.askedQuestions.has("goal")) {
			questions.push({
				id: "goal",
				text: "What are you trying to build or accomplish?",
				type: "text",
				required: true,
			})
			this.askedQuestions.add("goal")
		}

		// Question 2: What's your experience level?
		if (!this.askedQuestions.has("experience")) {
			questions.push({
				id: "experience",
				text: "What's your experience level with this technology?",
				type: "choice",
				options: ["Beginner", "Intermediate", "Advanced", "Expert"],
				required: true,
			})
			this.askedQuestions.add("experience")
		}

		// Question 3: What technologies are you using?
		if (!this.askedQuestions.has("tech")) {
			questions.push({
				id: "tech",
				text: "What technologies or frameworks are you using?",
				type: "multiChoice",
				options: ["React", "Vue", "Angular", "Node.js", "Python", "Java", "Other"],
				required: false,
			})
			this.askedQuestions.add("tech")
		}

		return questions.slice(0, this.maxQuestions)
	}

	/**
	 * Process user answers
	 */
	processAnswers(answers: Answer[]): Record<string, any> {
		const context: Record<string, any> = {}

		for (const answer of answers) {
			context[answer.questionId] = answer.value
		}

		return context
	}

	/**
	 * Get next question based on previous answer
	 */
	getNextQuestion(currentQ: Question, answer: Answer): Question | null {
		// Simple flow - no branching for now
		return null
	}

	/**
	 * Reset flow
	 */
	reset(): void {
		this.askedQuestions.clear()
	}
}
