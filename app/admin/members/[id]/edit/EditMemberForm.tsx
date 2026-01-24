"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMember } from "../../actions";
import { useToast } from "@/components/ui/ToastProvider";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";

type MemberData = {
    id: string;
    name: string | null;
    phone: string;
    email: string | null;
    zipcode: string;
    role: string;
    handicap: number | null;
};

export function EditMemberForm({ member }: { member: MemberData }) {
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        try {
            const res = await updateMember(member.id, formData);
            if (res && res.success) {
                addToast("Member updated successfully!", "success");
                router.refresh(); // Refresh to show new data
            }
        } catch {
            addToast("Failed to update member.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={member.name || ""}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                defaultValue={member.phone}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={member.email || ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zipcode">Zipcode</Label>
                            <Input
                                id="zipcode"
                                name="zipcode"
                                defaultValue={member.zipcode}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="handicap">Handicap Index</Label>
                            <Input
                                id="handicap"
                                name="handicap"
                                type="number"
                                step="0.1"
                                defaultValue={member.handicap?.toString() || ""}
                                placeholder="e.g. 12.5"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select id="role" name="role" defaultValue={member.role}>
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => router.back()}
                            className="w-full"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
