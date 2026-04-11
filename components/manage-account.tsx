"use client";

import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRightLeft,
  Clock3,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MonitorSmartphone,
  Shield,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

type AccountSession = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
};

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
};

type TeamInvite = {
  id: string;
  email: string;
  role: "Admin" | "Member";
  sentAt: string;
};

const initialSessions: AccountSession[] = [
  {
    id: "session-1",
    device: "Chrome on Windows",
    location: "Delhi, IN",
    lastActive: "Now",
    isCurrent: true,
  },
  {
    id: "session-2",
    device: "Safari on iPhone 15",
    location: "Noida, IN",
    lastActive: "12 minutes ago",
    isCurrent: false,
  },
  {
    id: "session-3",
    device: "Edge on MacBook Air",
    location: "Bengaluru, IN",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
];

const members: TeamMember[] = [
  {
    id: "member-1",
    name: "Sahil Kumar",
    email: "sahil@expense-track.dev",
    role: "Owner",
  },
  {
    id: "member-2",
    name: "Aarav Mehta",
    email: "aarav@expense-track.dev",
    role: "Admin",
  },
  {
    id: "member-3",
    name: "Neha Singh",
    email: "neha@expense-track.dev",
    role: "Member",
  },
];

const initialInvites: TeamInvite[] = [
  {
    id: "invite-1",
    email: "finance@acme.co",
    role: "Admin",
    sentAt: "Today, 9:20 AM",
  },
  {
    id: "invite-2",
    email: "ops@acme.co",
    role: "Member",
    sentAt: "Yesterday, 6:45 PM",
  },
];

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials;
}

export function ManageAccount() {
  const [sessions, setSessions] = React.useState<AccountSession[]>(initialSessions);
  const [invites, setInvites] = React.useState<TeamInvite[]>(initialInvites);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<"Admin" | "Member">(
    "Member",
  );
  const [transferMemberId, setTransferMemberId] = React.useState("");
  const [transferReason, setTransferReason] = React.useState("");
  const [transferConfirmed, setTransferConfirmed] = React.useState(false);

  const transferCandidates = React.useMemo(
    () => members.filter((member) => member.role !== "Owner"),
    [],
  );

  const handleLogoutCurrentDevice = React.useCallback(() => {
    toast.success("Logged out from this device (mock action)");
  }, []);

  const handleLogoutAllDevices = React.useCallback(() => {
    setSessions((prev) => prev.filter((session) => session.isCurrent));
    toast.success("Logged out from all other devices");
  }, []);

  const handleEndSession = React.useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    toast.success("Session ended");
  }, []);

  const handleRevokeInvite = React.useCallback((inviteId: string) => {
    setInvites((prev) => prev.filter((invite) => invite.id !== inviteId));
    toast.success("Invite revoked");
  }, []);

  const handleSendInvite = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const normalizedEmail = inviteEmail.trim().toLowerCase();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(normalizedEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }

      const alreadyExists =
        invites.some((invite) => invite.email === normalizedEmail) ||
        members.some((member) => member.email === normalizedEmail);

      if (alreadyExists) {
        toast.error("This email is already invited or part of your team");
        return;
      }

      const newInvite: TeamInvite = {
        id: `invite-${crypto.randomUUID()}`,
        email: normalizedEmail,
        role: inviteRole,
        sentAt: "Just now",
      };

      setInvites((prev) => [newInvite, ...prev]);
      setInviteEmail("");
      setInviteRole("Member");
      toast.success(`Invite sent to ${normalizedEmail}`);
    },
    [inviteEmail, inviteRole, invites],
  );

  const handleAccountTransfer = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!transferMemberId) {
        toast.error("Please select a member to transfer ownership");
        return;
      }

      if (!transferConfirmed) {
        toast.error("Please confirm the ownership transfer first");
        return;
      }

      const selectedMember = members.find((member) => member.id === transferMemberId);
      if (!selectedMember) {
        toast.error("Selected member is invalid");
        return;
      }

      toast.success(`Ownership transferred to ${selectedMember.name} (mock action)`);
      setTransferMemberId("");
      setTransferReason("");
      setTransferConfirmed(false);
    },
    [transferConfirmed, transferMemberId],
  );

  return (
    <Card className="border-border/60 bg-linear-to-b from-card via-card to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Lock className="size-5 text-primary" />
          Manage Account
        </CardTitle>
        <CardDescription>
          Security controls, active sessions, and team invites.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-3 rounded-2xl border border-border/70 bg-background/60 p-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium">Session Controls</p>
            <p className="text-sm text-muted-foreground">
              Sign out from this device or remove access from all devices.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <Button
              type="button"
              variant="outline"
              className="sm:min-w-52"
              onClick={handleLogoutCurrentDevice}
            >
              <LogOut className="size-4" />
              Logout Current Device
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="sm:min-w-52"
              onClick={handleLogoutAllDevices}
            >
              <Shield className="size-4" />
              Logout All Devices
            </Button>
          </div>
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <MonitorSmartphone className="size-4 text-primary" />
            <p className="text-sm font-semibold">Active Sessions</p>
            <Badge variant="outline">{sessions.length}</Badge>
          </div>

          <div className="space-y-2 rounded-2xl border border-border/70 bg-background/60 p-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-3 rounded-xl border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{session.device}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {session.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3.5" />
                      {session.lastActive}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {session.isCurrent && <Badge>Current</Badge>}
                  {!session.isCurrent && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEndSession(session.id)}
                    >
                      End Session
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <p className="text-sm font-semibold">Members</p>
              <Badge variant="outline">{members.length}</Badge>
            </div>

            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant={member.role === "Owner" ? "default" : "outline"}>
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="size-4 text-primary" />
              <p className="text-sm font-semibold">Invites</p>
              <Badge variant="outline">{invites.length}</Badge>
            </div>

            <form className="space-y-3" onSubmit={handleSendInvite}>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="invite-email">
                  Invite Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="invite-email"
                    type="email"
                    className="pl-9"
                    placeholder="teammate@company.com"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="invite-role">
                  Access Level
                </label>
                <Select
                  value={inviteRole}
                  onValueChange={(value) => setInviteRole(value as "Admin" | "Member")}
                >
                  <SelectTrigger id="invite-role" className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                <UserPlus className="size-4" />
                Send Invite
              </Button>
            </form>

            <div className="space-y-2">
              {invites.length === 0 && (
                <p className="rounded-xl border border-dashed border-border/70 px-3 py-2 text-sm text-muted-foreground">
                  No pending invites.
                </p>
              )}

              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{invite.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {invite.role} • {invite.sentAt}
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => handleRevokeInvite(invite.id)}
                    aria-label={`Revoke invite for ${invite.email}`}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <ArrowRightLeft className="size-4 text-amber-600 dark:text-amber-400" />
            <p className="text-sm font-semibold">Account Transfer</p>
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            >
              Dangerous Action
            </Badge>
          </div>

          <p className="mb-4 text-sm text-muted-foreground">
            Transfer ownership to another member. After transfer, you will lose
            owner-level permissions for billing and workspace controls.
          </p>

          <form className="space-y-4" onSubmit={handleAccountTransfer}>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="transfer-member">
                Transfer To
              </label>
              <Select value={transferMemberId} onValueChange={setTransferMemberId}>
                <SelectTrigger id="transfer-member" className="w-full">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {transferCandidates.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="transfer-reason">
                Transfer Note (Optional)
              </label>
              <Textarea
                id="transfer-reason"
                placeholder="Example: handing over ownership to finance lead"
                value={transferReason}
                onChange={(event) => setTransferReason(event.target.value)}
              />
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-3 py-2">
              <Checkbox
                checked={transferConfirmed}
                onCheckedChange={(value) => setTransferConfirmed(value === true)}
              />
              <span className="text-sm text-muted-foreground">
                I understand this ownership transfer is irreversible.
              </span>
            </label>

            <Button type="submit" variant="destructive" className="w-full sm:w-auto">
              <ArrowRightLeft className="size-4" />
              Transfer Account Ownership
            </Button>
          </form>
        </section>
      </CardContent>
    </Card>
  );
}
