import WaitingPage from "@/components/matches/waiting";
import { createClient } from "@/utils/supabase/server";

const wrapperComp = async () => {
	const supabase = await createClient();
	const user_id: string | undefined =
		(await supabase.auth.getUser()).data.user?.id || "";
	return <WaitingPage authId={user_id} />;
};

export default wrapperComp;
