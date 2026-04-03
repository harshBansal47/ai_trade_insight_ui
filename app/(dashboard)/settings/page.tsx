"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  ChevronRight,
  ExternalLink,
  Key,
  LogOut,
  Moon,
  Shield,
  Smartphone,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-sm font-semibold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="glass rounded-2xl border border-white/[0.07] divide-y divide-white/[0.04] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ── Row ────────────────────────────────────────────────────────────────────────

function SettingRow({
  icon: Icon,
  iconColor = "text-muted-foreground",
  iconBg = "bg-white/[0.05]",
  label,
  description,
  action,
  danger = false,
}: {
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  label: string;
  description?: string;
  action: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4 transition-colors",
        danger ? "hover:bg-red-400/[0.04]" : "hover:bg-white/[0.02]"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
          iconBg
        )}
      >
        <Icon className={cn("w-4 h-4", iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium",
            danger ? "text-red-400" : "text-foreground"
          )}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative w-10 h-5 rounded-full transition-all duration-300",
        enabled
          ? "bg-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.4)]"
          : "bg-white/[0.1]"
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300",
          enabled ? "left-5" : "left-0.5"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Preferences state
  const [notifications, setNotifications] = useState({
    analysisComplete: true,
    lowPoints: true,
    promotions: false,
    newsletter: false,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch { /* ignore */ }
    logout();
    document.cookie = "auth-token=; path=/; max-age=0";
    router.push("/");
    toast.success("Logged out successfully");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      // POST /auth/delete-account
      await new Promise((r) => setTimeout(r, 1500)); // placeholder
      logout();
      router.push("/");
      toast.success("Account deleted");
    } catch {
      toast.error("Failed to delete account. Please contact support.");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account, notifications and preferences
        </p>
      </div>

      {/* ── Account ──────────────────────────────────────── */}
      <Section
        title="Account"
        description="Your personal information and security"
      >
        <SettingRow
          icon={User}
          iconBg="bg-cyan-400/10"
          iconColor="text-cyan-400"
          label={user?.name ?? "Your Name"}
          description={user?.email}
          action={
            <a
              href="/profile"
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Edit <ChevronRight className="w-3.5 h-3.5" />
            </a>
          }
        />
        <SettingRow
          icon={Key}
          iconBg="bg-violet-400/10"
          iconColor="text-violet-400"
          label="Password"
          description="Change your account password"
          action={
            <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              Change <ChevronRight className="w-3.5 h-3.5" />
            </button>
          }
        />
        <SettingRow
          icon={Smartphone}
          iconBg="bg-green-400/10"
          iconColor="text-green-400"
          label="Two-factor authentication"
          description="Add extra security to your account"
          action={
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 font-medium">
              Coming soon
            </span>
          }
        />
      </Section>

      {/* ── Notifications ─────────────────────────────────── */}
      <Section
        title="Notifications"
        description="Choose what you want to be notified about"
      >
        <SettingRow
          icon={Bell}
          iconBg="bg-orange-400/10"
          iconColor="text-orange-400"
          label="Analysis complete"
          description="When your AI analysis finishes"
          action={
            <Toggle
              enabled={notifications.analysisComplete}
              onChange={(v) =>
                setNotifications((p) => ({ ...p, analysisComplete: v }))
              }
            />
          }
        />
        <SettingRow
          icon={AlertTriangle}
          iconBg="bg-yellow-400/10"
          iconColor="text-yellow-400"
          label="Low points alert"
          description="When you have fewer than 20 points"
          action={
            <Toggle
              enabled={notifications.lowPoints}
              onChange={(v) =>
                setNotifications((p) => ({ ...p, lowPoints: v }))
              }
            />
          }
        />
        <SettingRow
          icon={Bell}
          iconBg="bg-white/[0.05]"
          iconColor="text-muted-foreground"
          label="Promotions & offers"
          description="Discount codes and special deals"
          action={
            <Toggle
              enabled={notifications.promotions}
              onChange={(v) =>
                setNotifications((p) => ({ ...p, promotions: v }))
              }
            />
          }
        />
        <SettingRow
          icon={Bell}
          iconBg="bg-white/[0.05]"
          iconColor="text-muted-foreground"
          label="Product newsletter"
          description="Monthly updates and feature releases"
          action={
            <Toggle
              enabled={notifications.newsletter}
              onChange={(v) =>
                setNotifications((p) => ({ ...p, newsletter: v }))
              }
            />
          }
        />
      </Section>

      {/* ── Appearance ─────────────────────────────────────── */}
      <Section title="Appearance">
        <SettingRow
          icon={Moon}
          iconBg="bg-blue-400/10"
          iconColor="text-blue-400"
          label="Dark mode"
          description="Currently active — light mode coming soon"
          action={
            <Toggle enabled={true} onChange={() => toast("Dark mode is default — light mode coming soon!")} />
          }
        />
      </Section>

      {/* ── Security & Privacy ─────────────────────────────── */}
      <Section
        title="Security & Privacy"
        description="Control how your data is handled"
      >
        <SettingRow
          icon={Shield}
          iconBg="bg-green-400/10"
          iconColor="text-green-400"
          label="Privacy policy"
          description="Read how we use your data"
          action={
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          }
        />
        <SettingRow
          icon={Shield}
          iconBg="bg-cyan-400/10"
          iconColor="text-cyan-400"
          label="Terms of service"
          description="Our usage terms and conditions"
          action={
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          }
        />
      </Section>

      {/* ── Danger Zone ────────────────────────────────────── */}
      <Section title="Account actions">
        <SettingRow
          icon={LogOut}
          danger
          label="Sign out"
          description="Sign out of your account on this device"
          action={
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
            >
              Sign out <ChevronRight className="w-3.5 h-3.5" />
            </button>
          }
        />
        <SettingRow
          icon={Trash2}
          danger
          label="Delete account"
          description="Permanently remove your account and all data"
          action={
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
            >
              Delete <ChevronRight className="w-3.5 h-3.5" />
            </button>
          }
        />
      </Section>

      {/* ── App version ─────────────────────────────────────── */}
      <p className="text-center text-xs text-muted-foreground/30">
        CryptoAI Insights · v1.0.0
      </p>

      {/* ── Dialogs ────────────────────────────────────────── */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign out?</DialogTitle>
            <DialogDescription>
              You will be signed out of your account on this device. Your data will remain saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-white/[0.1] text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-400 transition-colors"
            >
              Sign out
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete account?</DialogTitle>
            <DialogDescription>
              This action is <strong className="text-foreground">permanent and irreversible</strong>. All your analyses, history, and unused points will be deleted immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-red-400/5 rounded-xl border border-red-400/20 text-xs text-red-300 space-y-1">
            <p>⚠ All analysis history will be deleted</p>
            <p>⚠ All unused points will be forfeited</p>
            <p>⚠ This cannot be undone</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-white/[0.1] text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Keep my account
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {deleting ? (
                <>
                  <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete permanently"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
