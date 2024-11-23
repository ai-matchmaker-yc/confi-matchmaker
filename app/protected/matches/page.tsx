

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
	matchId: number
};

// Transform LinkedIn data into a Match
const MatchedParser = (match: any): Match => {

	const data = match.matchedProfile.linkedin_data
	const person = data.person;
	const company = data.company;



	// Calculate a mock match percentage based on skills/background
	const matchPercentage = match.compatibility * 100 || 92; // This would be calculated by your matching algorithm
	console.log(match.compatibility)
	return {
		name: `${person.firstName} ${person.lastName}`,
		occupation: `${person.positions.positionHistory[0].title} at somewhere`,
		matchPercentage,
		matchId: match.id,
		profileImage: person.photoUrl || "https://preview.redd.it/7ayjc8s4j2n61.png?auto=webp&s=609a58fa21d46424879ee44156e44e0404940583",
		whyMeetReasons: match.match_reasons || [],
		conversationStarters: match.icebreakers
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
		.eq('source_user_id', '0ae03ae7-c84e-4f62-a724-b9001258d77c')


	console.log(rawMatches)
	const match = rawMatches ? MatchedParser(rawMatches[0]) : null;
	// const matches = match ? [match, ...defaultMatches] : defaultMatches;
	const matches = rawMatches?.map((m) => MatchedParser(m))
	return (
		<div className="flex gap-4 flex-col w-full p-4">
			{matches.map((match, index) => (
				<RecommendationCard
					key={index}
					name={match.name}
					matchId={match.matchId || 45}

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


