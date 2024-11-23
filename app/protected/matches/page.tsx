

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
const MatchedParser = (match: any): Match => {

	const data = match.matchedProfile.linkedin_data
	console.log("hedd", match.match_reasons)
	const person = data.person;
	const company = data.company;



	// Calculate a mock match percentage based on skills/background
	const matchPercentage = 92; // This would be calculated by your matching algorithm

	return {
		name: `${person.firstName} ${person.lastName}`,
		occupation: `${person.positions.positionHistory[0].title} at ${company.name}`,
		matchPercentage,
		profileImage: person.photoUrl,
		whyMeetReasons: match.match_reasons,
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
	// Transform the LinkedIn data into a Match if profiles exist

	let { data: rawMatches } = await supabase
		.from('matches')
		.select(`
		*,
		matchedProfile:profiles!match_user_id (*)
		`)
		.eq('id', '1')


	console.log(rawMatches)
	const match = rawMatches ? MatchedParser(rawMatches[0]) : null;
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
					profileImageUrl={match.profileImage}
				/>
			))}
		</div>
	);
};

export default RecommendationScreen;


