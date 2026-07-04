import { useState, useEffect } from "react";
import { Inbox, Mail, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db, type MockEmail } from "@/mock/db";

export function GlobalSimulatedInbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [emails, setEmails] = useState<MockEmail[]>(() => db.emails);

  const refreshMailbox = () => {
    setEmails([...db.emails]);
  };

  // Sync emails periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setEmails([...db.emails]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Floating Mailbox Indicator */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            refreshMailbox();
            setIsOpen(true);
          }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Inbox className="h-6 w-6" />
          {emails.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-bounce">
              {emails.length}
            </span>
          )}
        </button>
      </div>

      {/* Mailbox Slider Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            {/* Slide-out drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-full flex-col bg-background shadow-2xl sm:max-w-md border-l border-border"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="font-semibold">Simulated Inbox</h2>
                    <p className="text-[10px] text-muted-foreground">
                      Demo simulation of sent invite emails
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {emails.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                    <div className="rounded-full bg-muted p-4">
                      <Mail className="h-8 w-8 text-muted-foreground/60" />
                    </div>
                    <h3 className="font-medium text-foreground">No Invites Sent Yet</h3>
                    <p className="text-xs text-muted-foreground max-w-[280px]">
                      Sign up or log in as a **PG Owner (Admin)**, go to the **Tenants** or
                      **Staff** dashboard, add a member, and send them an access link invite.
                    </p>
                  </div>
                ) : (
                  emails.map((email) => (
                    <motion.div
                      key={email.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-border bg-card p-4 shadow-sm space-y-2 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col gap-1">
                          {email.from && (
                            <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground self-start">
                              From: {email.from}
                            </span>
                          )}
                          <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary self-start">
                            To: {email.to}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(email.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-foreground">{email.subject}</h4>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {email.body}
                      </p>
                      <div className="pt-2">
                        <a
                          href={email.linkUrl}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Access Portal Directly <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
