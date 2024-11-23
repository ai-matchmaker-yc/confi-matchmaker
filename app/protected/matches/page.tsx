

import RecommendationCard from "@/components/matches/recommendation-card";
import { createClient } from "@/utils/supabase/client";

// Define the type for a match
type Match = {
	name: string;
	occupation: string;
	matchPercentage: number;
	whyMeetReasons: string[];
	conversationStarters: string[];
	profileImage?: string; // Optional profile image URL
};

// Transform LinkedIn data into a Match
const linkedInToMatch = (data: any): Match => {
	const person = data.person;
	const company = data.company;
	
	// Calculate a mock match percentage based on skills/background
	const matchPercentage = 92; // This would be calculated by your matching algorithm

	return {
		name: `${person.firstName} ${person.lastName}`,
		occupation: `${person.positions.positionHistory[0].title} at ${company.name}`,
		matchPercentage,
		profileImage: person.photoUrl,
		whyMeetReasons: [
			`Both work in ${company.industry}`,
			`Similar background in ${person.skills.slice(0, 2).join(" and ")}`,
			`Both interested in technology and innovation`
		],
		conversationStarters: [
			`I see you worked on ${person.positions.positionHistory[1].companyName}. What was that experience like?`,
			`What's it like working at ${company.name}?`,
			`I noticed you know ${person.languages.join(" and ")}. How did you learn them?`
		]
	};
};

// Sample matches data
const defaultMatches: Match[] = [
	{
		name: "Sarah Chen",
		occupation: "Software Engineer at Google",
		matchPercentage: 95,
		whyMeetReasons: [
			"You both work in IT",
			"Similar interest in AI/ML",
			"Both attended Stanford"
		],
		conversationStarters: [
			"What have you recently worked on?",
			"What's your take on the latest LLM developments?"
		]
	},
	{
		name: "Michael Rodriguez",
		occupation: "Product Manager at Microsoft",
		matchPercentage: 88,
		whyMeetReasons: [
			"Both interested in product development",
			"Similar conference goals"
		],
		conversationStarters: [
			"What brought you to this conference?",
			"How do you approach product strategy?"
		]
	},
	// Add more matches as needed
];

const RecommendationScreen = async () => {
	const supabase = await createClient();
	
	let { data: profiles, error } = await supabase
		.from('profiles')
		.select("*")
		.eq('id', '0ae03ae7-c84e-4f62-a724-b9001258d77c');
	// Transform the LinkedIn data into a Match if profiles exist
	const match = profiles ? linkedInToMatch(profiles[0].linkedin_data) : null;
	const matches = match ? [match, ...defaultMatches] : defaultMatches;

	return (
		<div className="flex gap-4 flex-col w-full p-4">
			{matches.map((match, index) => (
				<RecommendationCard
					key={index}
					name={match.name}
					
					occupation={match.occupation}
					matchPercentage={match.matchPercentage}
					whyMeetReasons={match.whyMeetReasons}
					conversationStarters={match.conversationStarters}
					profileImage={match.profileImage}
				/>
			))}
		</div>
	);
};

export default RecommendationScreen;
