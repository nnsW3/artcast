import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { Cast } from "@/lib/types/cast.interface"
import { convertSupabaseDateToHumanReadable } from "@/lib/utils";
import { AuthorLink } from "./AuthorLink";

async function Version({ cast }: { cast: Cast }) {

    async function getPublicUrl(image_path: string) {
        const { data } = supabaseClient.storage.from('artcast_images').getPublicUrl(image_path as string);
        return data.publicUrl;
    }

    let url = await getPublicUrl(cast.image_path as string);

    return (
        <a href={`/cast/${cast.id}`}>
            <div className="flex items-center">
                <span className="relative flex shrink-0 overflow-hidden rounded-md h-9 w-9">
                    <img className="aspect-square h-full w-full" alt="Avatar" src={url} />
                </span>
                <div className="ml-4 space-y-1">
                    {cast.prompt_input ? <p className="text-sm leading-none italic">"{cast.prompt_input}"</p> : null}
                    <p className="block text-sm mb-4 font-normal leading-none text-gray-400 dark:text-gray-500">by <AuthorLink farcasterId={cast.farcaster_id} /></p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">{convertSupabaseDateToHumanReadable(cast.created_at)}</div>
            </div>
        </a>
    )
}

export function LatestPrompts({ versions }: { versions: Cast[] }) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold leading-none tracking-tight">Direct Children</h3>
                <p className="text-sm text-muted-foreground">{versions.length == 0 ? 'Nobody has remixed this Artcast yet.' : 'Below are all of the remixes of this Artcast.'}</p>
            </div>
            <div className="p-6 pt-0">
                <div className="space-y-8">
                    {versions.map((version, index) => <Version key={index} cast={version}></Version>)}
                </div>
            </div>
        </div>
    )
}