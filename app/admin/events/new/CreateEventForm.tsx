"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "../actions";
import { useToast } from "@/components/ui/ToastProvider";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

export function CreateEventForm() {
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        try {
            const res = await createEvent(formData);
            if (res && res.success) {
                addToast("Event created successfully!", "success");
                // Small delay to let user see the success state
                setTimeout(() => {
                    router.push("/admin/events");
                }, 1000);
            }
        } catch {
            addToast("Failed to create event.", "error");
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g. Summer Start Scramble"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Details about the tournament..."
                            rows={3}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" name="date" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input id="time" name="time" type="time" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            placeholder="e.g. Galloping Hill Golf Course"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maxParticipants">Capacity (Optional)</Label>
                        <Input
                            id="maxParticipants"
                            name="maxParticipants"
                            type="number"
                            placeholder="e.g. 72"
                        />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating..." : "Create Event"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
