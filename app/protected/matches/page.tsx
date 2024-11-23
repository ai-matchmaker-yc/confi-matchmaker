

import RecommendationCard from "@/components/matches/recommendation-card";
import { createClient } from "@/utils/supabase/server";

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
	const matchPercentage = Math.min(95, match.compatibility * 100 * 1.6) || 92; // This would be calculated by your matching algorithm
	console.log(match.compatibility)

	let companyName = null
	try {
		companyName = person.positions.positionHistory[0].companyName
	} catch (error) {
		console.log('no company name')
	}

	let position = null
	try {
		position = person.positions.positionHistory[0].title
	} catch (error) {
		console.log('no position title')
	}

	let occupationString = ''
	if (companyName && position) {
		occupationString = `${position} at ${companyName}`
	} else if (companyName) {
		occupationString = companyName
	} else if (position) {
		occupationString = position
	}

	return {
		name: `${person.firstName} ${person.lastName}`,
		occupation: occupationString,
		matchPercentage,
		matchId: match.id,
		profileImage: person.photoUrl || "https://preview.redd.it/7ayjc8s4j2n61.png?auto=webp&s=609a58fa21d46424879ee44156e44e0404940583",
		whyMeetReasons: match.match_reasons || [],
		conversationStarters: match.icebreakers
	};
};

// Sample matches data
const defaultMatches: Match[] = [];

const RecommendationScreen = async () => {
	const supabase = await createClient();
	// Transform the LinkedIn data into a Match if profiles exist

	const user_id = (await supabase.auth.getUser()).data.user?.id


	console.log("userid", user_id)

	let { data: rawMatches } = await supabase
		.from('matches')
		.select(`
		*,
		matchedProfile:profiles!match_user_id (*)
		`)
		.eq('source_user_id', user_id || "hej")


	console.log("rawMatches", rawMatches)
	// const matches = match ? [match, ...defaultMatches] : defaultMatches;
	const matches = rawMatches?.map((m) => MatchedParser(m))

	const sortedMatches = matches?.sort((a, b) => b.matchPercentage - a.matchPercentage);

	return (
		<div className="flex gap-4 flex-col w-full p-4">
			{matches!.map((match, index) => (
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


