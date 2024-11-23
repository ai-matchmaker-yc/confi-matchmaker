"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
	Star,
	MessageCircle,
	ThumbsUp,
	User,
	Briefcase,
	Calendar,
} from "lucide-react";
interface RecommendationCardProps {
	name: string;
	occupation: string;
	matchPercentage: number;
	profileImageUrl?: string;
	whyMeetReasons: string[];
	conversationStarters: string[];
	interests?: string[];
	matchId: number;
}

const RecommendationCard = ({
	name,
	occupation,
	matchPercentage,
	profileImageUrl = "",
	whyMeetReasons,
	conversationStarters,
	interests = [],
	matchId
}: RecommendationCardProps) => {
	const [expanded, setExpanded] = useState(false);
	const [meetingStatus, setMeetingStatus] = useState<"met" | "not-met" | null>(
		null
	);
	const [showFeedback, setShowFeedback] = useState(false);

	const supabase = createClientComponentClient()


	return (
		<Card className="w-full max-w-md mx-auto shadow-lg">
			<CardHeader className="space-y-1">
				<div className="flex items-center space-x-4">
					<div className="w-16 h-16 bg-gray-200 rounded-full">
						<img
							src={profileImageUrl}
							alt={`${name}'s profile`}
							className="w-full h-full rounded-full object-cover"
						/>
					</div>
					<div>
						<h3 className="text-lg font-semibold">{name}</h3>
						<div className="flex items-center text-sm text-gray-600">
							<Briefcase className="w-4 h-4 mr-1" />
							<span>{occupation}</span>
						</div>
						<div className="flex items-center text-sm text-gray-600">
							<Star className="w-4 h-4 mr-1 text-yellow-500" />
							<span>{`${Math.round(matchPercentage)}% Match`}</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{!expanded ? (
					<div className="space-y-2">
						<h4 className="font-medium">Why You Should Meet:</h4>
						<ul className="space-y-1 text-sm">
							{whyMeetReasons.map((reason, index) => (
								<li key={index} className="flex items-center">
									<ThumbsUp className="w-4 h-4 mr-2 text-green-500 flex" />
									{reason}
								</li>
							))}
						</ul>
						<Button className="w-full mt-4" onClick={() => setExpanded(true)}>
							See More Details
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						<div>
							<h4 className="font-medium">Conversation Starters:</h4>
							<ul className="mt-2 space-y-2 text-sm">
								{conversationStarters.map((starter, index) => (
									<li key={index} className="flex items-start">
										<MessageCircle className="w-4 h-4 mr-2 mt-1 text-blue-500" />
										{starter}
									</li>
								))}
							</ul>
						</div>
						<div>
							<h4 className="font-medium">Common Interests:</h4>
							<div className="flex flex-wrap gap-2 mt-2">
								{interests.map((interest, index) => (
									<span
										key={index}
										className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
									>
										{interest}
									</span>
								))}
							</div>
						</div>
						{!meetingStatus ? (
							<div className="flex gap-2">
								<Button
									className="flex-1"
									onClick={() => setMeetingStatus("met")}
								>
									I Met Them
								</Button>
								<Button
									className="flex-1"
									variant="outline"
									onClick={() => setMeetingStatus("not-met")}
								>
									Couldn't Meet
								</Button>
							</div>
						) : meetingStatus === "met" && !showFeedback ? (
							<div className="space-y-4">
								<h4 className="font-medium">How was your conversation?</h4>
								<div className="flex justify-center space-x-2">
									{[1, 2, 3, 4, 5].map((rating) => (
										<button
											key={rating}
											className="text-yellow-400 hover:text-yellow-500"
											onClick={async () => { setShowFeedback(true); console.log(await supabase.from("matches").update({ rating: rating }).eq("id", matchId).select()) }}
										>
											<Star className="w-6 h-6" />
										</button>
									))}
								</div>
							</div>
						) : null}
					</div>
				)}
			</CardContent>
		</Card >
	);
};
export default RecommendationCard;
