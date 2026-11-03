'use client';

import React from 'react';
import { BentoGrid, BentoCard } from './bento-grid';
import { Terminal, Database, Sparkles, Layers, Shield } from 'lucide-react';

export function BentoGridDemo() {
  return (
    <div className="w-full p-6">
      <BentoGrid>
        <BentoCard
          className="md:col-span-2"
          title="Streaming RPC Gateway"
          description="Sub-millisecond protocol buffer serialization with automatic client retries and adaptive window scaling."
          icon={<Terminal className="h-4 w-4" />}
          badge="High Throughput"
          header={
            <div className="flex h-full items-center justify-center p-4 font-mono text-xs text-emerald-400">
              <span className="text-slate-500">$</span> grpcurl -plaintext localhost:50051 list
            </div>
          }
        />

        <BentoCard
          title="Edge Cache"
          description="Globally replicated key-value storage with stale-while-revalidate guarantees."
          icon={<Database className="h-4 w-4" />}
          header={
            <div className="flex h-full items-center justify-center">
              <div className="h-16 w-16 rounded-full border border-dashed border-emerald-500/40 flex items-center justify-center text-xs text-emerald-400">
                99.98%
              </div>
            </div>
          }
        />

        <BentoCard
          title="Zero-Knowledge Enclave"
          description="Hardware-enforced memory encryption protecting customer secrets."
          icon={<Shield className="h-4 w-4" />}
          header={
            <div className="flex h-full items-center justify-center">
              <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />
            </div>
          }
        />

        <BentoCard
          className="md:col-span-2"
          title="Multi-Cloud Topology"
          description="Deploy across AWS, GCP, and bare metal with unified ingress and automated failover."
          icon={<Layers className="h-4 w-4" />}
          badge="Anycast"
          header={
            <div className="flex h-full items-center justify-center gap-6 text-slate-500 text-xs font-mono">
              <span className="text-emerald-400">us-east-1</span> • <span>eu-central-1</span> • <span>ap-northeast-1</span>
            </div>
          }
        />
      </BentoGrid>
    </div>
  );
}

export default BentoGridDemo;

