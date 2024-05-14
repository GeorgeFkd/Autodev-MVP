import { useGlobalState } from "@/contexts/AppContext";
import { AppContext } from "@/types/types";
import { useRouter } from "next/navigation";

export function useGoHome({ condition }: { condition: (ctx: AppContext) => boolean }) {
    const router = useRouter();
    const { appState } = useGlobalState();
    if (appState == null || condition(appState)) {
        console.log("Rerouting to home page...")
        router.replace("/");
    }
}