"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Award,
  BadgeCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock,
  Languages,
  Mail,
  MapPin,
  Phone,
  Play,
  Star,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/formatters";
import { providerProfiles } from "@/lib/mock-data/provider-profiles";
import { PortfolioMedia, ServiceProvider } from "@/types";

interface ProviderProfileDialogProps {
  provider: ServiceProvider | null;
  onClose: () => void;
  onBook: (provider: ServiceProvider) => void;
}

type MediaFilter = "all" | "image" | "video";

export function ProviderProfileDialog({
  provider,
  onClose,
  onBook,
}: ProviderProfileDialogProps) {
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  if (!provider) return null;

  const profile = providerProfiles[provider.id];
  const portfolio = profile?.portfolio ?? [];
  const reviews = profile?.reviews ?? [];

  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) {
            setLightboxId(null);
            onClose();
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl bg-white border-zinc-200 text-zinc-900 p-0 gap-0">
          {/* Header */}
          <div className="p-5 pb-4 border-b border-zinc-200 pr-12">
            <div className="flex items-start gap-4">
              <div className="size-14 shrink-0 rounded-sm bg-brand-700 text-white grid place-items-center text-lg font-bold">
                {initials(provider.businessName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-xl font-bold text-zinc-900">
                    {provider.businessName}
                  </DialogTitle>
                  {provider.verificationStatus === "verified" && (
                    <BadgeCheck className="size-4 text-brand-700" aria-label="Verified" />
                  )}
                </div>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  {profile?.tagline ?? provider.categories.join(" • ")}
                </DialogDescription>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-xs">
                  <span className="flex items-center gap-1 font-bold text-zinc-900">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {provider.rating.toFixed(1)}
                    <span className="font-normal text-zinc-500">
                      ({provider.reviewCount} reviews)
                    </span>
                  </span>
                  <StatusBadge status={provider.availability} />
                  <StatusBadge status={provider.verificationStatus} />
                </div>
              </div>
            </div>

            {profile && (
              <dl className="grid grid-cols-3 gap-2 mt-4">
                <Stat label="Experience" value={`${profile.yearsExperience} yrs`} />
                <Stat label="Jobs done" value={profile.completedJobs.toLocaleString()} />
                <Stat label="Responds" value={profile.responseTime} />
              </dl>
            )}
          </div>

          <Tabs defaultValue="about" className="gap-0">
            <TabsList
              variant="line"
              className="w-full border-b border-zinc-200 px-5 h-10"
            >
              <TabsTrigger value="about" className="flex-none px-3">
                About
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex-none px-3">
                Portfolio
                {portfolio.length > 0 && (
                  <span className="ml-1 text-[10px] text-zinc-500">
                    {portfolio.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-none px-3">
                Reviews
              </TabsTrigger>
            </TabsList>

            <div className="p-5 min-h-72">
              <TabsContent value="about" className="space-y-5 text-xs">
                <p className="text-zinc-600 leading-relaxed">{provider.description}</p>

                <div className="p-3 rounded-sm bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                  <span className="font-semibold text-zinc-900">Indicative base fee</span>
                  <span className="text-base font-bold text-zinc-900">
                    {formatCurrency(provider.indicativeStartingPrice)}
                  </span>
                </div>

                {profile && profile.services.length > 0 && (
                  <Section title="Services offered">
                    <Chips items={profile.services} />
                  </Section>
                )}

                <Section title="Service coverage areas">
                  <div className="flex items-start gap-1.5 text-zinc-600">
                    <MapPin className="size-3.5 mt-0.5 text-zinc-400 shrink-0" />
                    <Chips items={provider.serviceAreas} />
                  </div>
                </Section>

                {profile && profile.certifications.length > 0 && (
                  <Section title="Certifications">
                    <ul className="space-y-1.5">
                      {profile.certifications.map((c) => (
                        <li key={c} className="flex items-center gap-2 text-zinc-700">
                          <Award className="size-3.5 text-brand-700" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                <Section title="Contact">
                  <ul className="space-y-1.5 text-zinc-700">
                    <li className="flex items-center gap-2">
                      <Briefcase className="size-3.5 text-zinc-400" />
                      {provider.contactPerson}
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="size-3.5 text-zinc-400" />
                      {provider.phone}
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="size-3.5 text-zinc-400" />
                      {provider.email}
                    </li>
                    {profile && (
                      <>
                        <li className="flex items-center gap-2">
                          <Languages className="size-3.5 text-zinc-400" />
                          {profile.languages.join(", ")}
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="size-3.5 text-zinc-400" />
                          Typically responds: {profile.responseTime}
                        </li>
                      </>
                    )}
                  </ul>
                </Section>
              </TabsContent>

              <TabsContent value="portfolio">
                <PortfolioGallery items={portfolio} onOpen={setLightboxId} />
              </TabsContent>

              <TabsContent value="reviews" className="space-y-2.5 text-xs">
                {reviews.length === 0 ? (
                  <EmptyState text="No written reviews yet." />
                ) : (
                  reviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-sm bg-zinc-50 border border-zinc-200 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-zinc-800">
                          {r.author}{" "}
                          <span className="font-normal text-zinc-500">({r.unit})</span>
                        </span>
                        <span className="flex items-center gap-1 font-bold text-zinc-800 shrink-0">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          {r.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-zinc-600 italic">&quot;{r.comment}&quot;</p>
                      <p className="text-[10px] text-zinc-400">
                        {new Date(r.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))
                )}
              </TabsContent>
            </div>
          </Tabs>

          <div className="mx-5 mb-4 p-2.5 rounded-sm bg-zinc-100 text-[11px] text-zinc-600 border border-zinc-200">
            Notice: All payments and service contracts in this prototype are illustrative estimates for presentation. No live payments are processed.
          </div>

          <DialogFooter className="border-t border-zinc-200 p-4 m-0 gap-2 rounded-b-sm">
            <Button variant="outline" onClick={onClose} className="border-zinc-300 text-xs">
              Close
            </Button>
            <Button
              onClick={() => onBook(provider)}
              className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs"
            >
              Request Service Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Lightbox
        items={portfolio}
        activeId={lightboxId}
        onChange={setLightboxId}
      />
    </>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded-sm bg-zinc-50 border border-zinc-200 text-center">
      <dd className="text-sm font-bold text-zinc-900">{value}</dd>
      <dt className="text-[10px] text-zinc-500">{label}</dt>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="font-semibold text-zinc-800">{title}</h3>
      {children}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="px-2 py-0.5 rounded-sm bg-zinc-100 border border-zinc-300 text-zinc-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-12 text-center text-xs text-zinc-500 border border-dashed border-zinc-300 rounded-sm">
      {text}
    </div>
  );
}

/* ---------------------------------- Gallery --------------------------------- */

function PortfolioGallery({
  items,
  onOpen,
}: {
  items: PortfolioMedia[];
  onOpen: (id: string) => void;
}) {
  const [filter, setFilter] = useState<MediaFilter>("all");

  if (items.length === 0) {
    return <EmptyState text="This provider has not added work samples yet." />;
  }

  const videos = items.filter((m) => m.kind === "video");
  const visible = items.filter((m) => filter === "all" || m.kind === filter);
  const filters: { value: MediaFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: items.length },
    { value: "image", label: "Photos", count: items.length - videos.length },
    { value: "video", label: "Videos", count: videos.length },
  ];

  return (
    <div className="space-y-4">
      {/* Vertical short-video reels, TikTok style */}
      {videos.length > 0 && filter !== "image" && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-zinc-800">Video reels</h3>
          <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:thin]">
            {videos.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onOpen(v.id)}
                className="group relative w-28 sm:w-32 shrink-0 snap-start aspect-9/16 rounded-sm overflow-hidden bg-zinc-900 text-left focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                <MediaThumb media={v} />
                <PlayBadge />
                <span className="absolute inset-x-0 bottom-0 p-2 pt-6 bg-linear-to-t from-black/80 to-transparent text-[10px] leading-tight text-white line-clamp-2">
                  {v.caption}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            disabled={f.count === 0}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-40 ${
              filter === f.value
                ? "bg-brand-700 text-white font-semibold"
                : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-2 sm:columns-3 gap-2.5">
        {visible.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onOpen(m.id)}
            style={{ aspectRatio: m.aspect }}
            className="group relative block w-full mb-2.5 break-inside-avoid rounded-sm overflow-hidden bg-zinc-200 focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <MediaThumb media={m} />
            {m.kind === "video" && <PlayBadge />}
            <span className="absolute inset-x-0 bottom-0 p-2 pt-6 bg-linear-to-t from-black/70 to-transparent text-[11px] text-white text-left opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
              {m.caption}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MediaThumb({ media }: { media: PortfolioMedia }) {
  const src = media.kind === "video" ? media.poster : media.src;
  if (!src) return <div className="size-full bg-zinc-800" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={media.caption}
      loading="lazy"
      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  );
}

function PlayBadge() {
  return (
    <span className="absolute inset-0 grid place-items-center pointer-events-none">
      <span className="size-9 rounded-full bg-black/55 backdrop-blur-sm grid place-items-center">
        <Play className="size-4 fill-white text-white ml-0.5" />
      </span>
    </span>
  );
}

/* --------------------------------- Lightbox --------------------------------- */

function Lightbox({
  items,
  activeId,
  onChange,
}: {
  items: PortfolioMedia[];
  activeId: string | null;
  onChange: (id: string | null) => void;
}) {
  const index = items.findIndex((m) => m.id === activeId);
  const active = index >= 0 ? items[index] : null;

  const step = useCallback(
    (delta: number) => {
      if (items.length === 0 || index < 0) return;
      onChange(items[(index + delta + items.length) % items.length].id);
    },
    [items, index, onChange]
  );

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, step]);

  return (
    <Dialog open={Boolean(active)} onOpenChange={(open) => !open && onChange(null)}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-3xl bg-black border-zinc-800 text-white p-0 gap-0 overflow-hidden"
      >
        {active && (
          <>
            <DialogTitle className="sr-only">{active.caption}</DialogTitle>
            <DialogDescription className="sr-only">
              Work sample {index + 1} of {items.length}
            </DialogDescription>

            <div className="relative grid place-items-center bg-black max-h-[75dvh]">
              <MediaViewer key={active.id} media={active} />
            </div>

            <div className="flex items-center justify-between gap-3 p-3 text-xs">
              <div className="min-w-0">
                <p className="font-medium truncate">{active.caption}</p>
                <p className="text-zinc-400">
                  {index + 1} / {items.length}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <LightboxButton label="Previous" onClick={() => step(-1)}>
                  <ChevronLeft className="size-4" />
                </LightboxButton>
                <LightboxButton label="Next" onClick={() => step(1)}>
                  <ChevronRight className="size-4" />
                </LightboxButton>
                <LightboxButton label="Close" onClick={() => onChange(null)}>
                  <X className="size-4" />
                </LightboxButton>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function LightboxButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      className="text-white hover:bg-white/15 hover:text-white"
    >
      {children}
      <span className="sr-only">{label}</span>
    </Button>
  );
}

function MediaViewer({ media }: { media: PortfolioMedia }) {
  if (media.kind === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.src}
        alt={media.caption}
        className="max-h-[75dvh] w-auto max-w-full object-contain"
      />
    );
  }

  if (media.platform === "tiktok") {
    return (
      <iframe
        src={`https://www.tiktok.com/embed/v2/${encodeURIComponent(media.src)}`}
        title={media.caption}
        allow="fullscreen; autoplay; encrypted-media"
        className="w-full max-w-sm h-[70dvh] border-0"
      />
    );
  }

  return (
    <video
      src={media.src}
      poster={media.poster}
      controls
      autoPlay
      loop
      playsInline
      className="max-h-[75dvh] w-auto max-w-full"
    />
  );
}
