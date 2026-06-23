              {/* Detection + Pillar Charts with view switcher */}
              {(() => {
                const constraintData = primary ? [
                  { name: primary.name, score: primary.verification_score || 94, color: '#C8A24A', label: 'Primary' },
                  ...(secondary.slice(0,3).map((c: any, i: number) => ({
                    name: c.name, score: c.verification_score || 65,
                    color: i === 0 ? '#cc4444' : i === 1 ? '#4a8ab0' : '#888',
                    label: `Secondary ${i+1}`
                  })))
                ] : []
                const pillarData = health.pillars ? Object.entries(health.pillars).map(([name, data]: [string, any]) => ({
                  name: name.charAt(0).toUpperCase() + name.slice(1),
                  score: data.score,
                  color: data.score >= 70 ? '#4aaa4a' : data.score >= 45 ? '#C8A24A' : '#cc4444',
                  benchmark: isEstate ? ({ growth: 14, operations: 15, strategy: 13, risk: 12, context: 11 } as any)[name] || 13
                    : isMarketing ? ({ growth: 15, operations: 14, strategy: 14, risk: 13, context: 12 } as any)[name] || 13
                    : isAccounting ? ({ growth: 13, operations: 16, strategy: 13, risk: 14, context: 12 } as any)[name] || 13
                    : 13
                })) : []
                const industryLabel = isEstate ? 'Estate Agency' : isMarketing ? 'Marketing Agency' : isAccounting ? 'Accountancy' : 'Your Sector'
                const totalC = constraintData.reduce((s: number, c: any) => s + c.score, 0)
                const healthScore = health.overall_score || health.overall || 0
                return (
                  <div>
                    {/* Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ fontSize: '10px', color: '#ddd', letterSpacing: '0.2em', fontWeight: '600' }}>INTELLIGENCE CHARTS</div>
                      <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '6px', padding: '2px' }}>
                        {(['bar','column','pie','radar'] as const).map(v => (
                          <button key={v} onClick={() => setChartView(v)} style={{ padding: '5px 12px', borderRadius: '4px', border: 'none', backgroundColor: chartView === v ? '#C8A24A' : 'transparent', color: chartView === v ? '#050505' : '#555', fontSize: '11px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.2s', textTransform: 'capitalize' as const }}>{v}</button>
                        ))}
                      </div>
                    </div>

                    {/* CONSTRAINT CHART */}
                    {primary && (
                      <div style={{ padding: '24px 28px', backgroundColor: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', marginBottom: '16px', overflow: 'hidden' as const }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <div style={{ fontSize: '10px', color: '#ddd', letterSpacing: '0.2em', fontWeight: '600' }}>CONSTRAINT DETECTION ENGINE — LIVE</div>
                          <div style={{ fontSize: '9px', color: '#555' }}>VERIFICATION SCORES / 100</div>
                        </div>

                        {/* BAR - glowing horizontal bars with score pills */}
                        {chartView === 'bar' && (
                          <div>
                            {constraintData.map((c: any, i: number) => (
                              <div key={i} style={{ marginBottom: i === constraintData.length - 1 ? 0 : '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {i === 0 && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: c.color, boxShadow: `0 0 8px ${c.color}` }} />}
                                    <div style={{ fontSize: '12px', color: '#e8e0c8', fontWeight: i === 0 ? '700' : '400' }}>{c.name}</div>
                                  </div>
                                  <div style={{ fontSize: '12px', fontWeight: '800', color: c.color, backgroundColor: `${c.color}1a`, padding: '2px 10px', borderRadius: '10px' }}>{c.score}</div>
                                </div>
                                <div style={{ height: '18px', backgroundColor: '#0a0a0a', borderRadius: '9px', overflow: 'hidden', position: 'relative' as const, border: '1px solid #1f1f1f' }}>
                                  <div style={{ width: c.score + '%', height: '100%', background: `linear-gradient(90deg, ${c.color}55, ${c.color})`, borderRadius: '9px', transition: 'width 1s ease', boxShadow: `0 0 12px ${c.color}88` }} />
                                </div>
                                {i === 0 && <div style={{ fontSize: '9px', color: c.color, marginTop: '5px', letterSpacing: '0.15em', fontWeight: '700' }}>▲ PRIMARY CONSTRAINT</div>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* COLUMN - tall gradient columns with glow */}
                        {chartView === 'column' && (
                          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '28px', height: '220px', paddingBottom: '32px', paddingTop: '8px', paddingLeft: '28px', position: 'relative' as const, overflow: 'hidden' as const }}>
                            {[0,25,50,75,100].map(line => (
                              <div key={line} style={{ position: 'absolute' as const, left: 0, right: 0, bottom: `${(line/100)*160 + 32}px`, borderTop: '1px solid #1a1a1a', pointerEvents: 'none' as const }}>
                                <span style={{ position: 'absolute' as const, left: '4px', fontSize: '9px', color: '#444', top: '-6px' }}>{line}</span>
                              </div>
                            ))}
                            {constraintData.map((c: any, i: number) => (
                              <div key={i} style={{ width: '100px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '8px', position: 'relative' as const, zIndex: 1 }}>
                                <div style={{ fontSize: '15px', fontWeight: '800', color: c.color }}>{c.score}</div>
                                <div style={{ width: '64%', height: `${(c.score/100)*160}px`, background: `linear-gradient(180deg, ${c.color}, ${c.color}44)`, borderRadius: '10px 10px 4px 4px', transition: 'height 1s ease', minHeight: '4px', boxShadow: `0 0 18px ${c.color}66` }} />
                                <div style={{ fontSize: '9px', color: '#999', textAlign: 'center' as const, lineHeight: '1.3', fontWeight: i === 0 ? '700' as const : '400' as const }}>{c.name.split(' ').slice(0,2).join(' ')}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* PIE - glowing donut with gradient ring */}
                        {chartView === 'pie' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
                            <svg width="190" height="190" viewBox="0 0 190 190" style={{ flexShrink: 0 }}>
                              <defs>
                                <filter id="pieGlowC" x="-50%" y="-50%" width="200%" height="200%">
                                  <feGaussianBlur stdDeviation="4" result="b" />
                                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                              </defs>
                              <circle cx="95" cy="95" r="78" fill="none" stroke="#1a1a1a" strokeWidth="20" />
                              {constraintData.reduce((acc: any[], c: any) => {
                                const pct = c.score / totalC
                                const prev = acc.reduce((s: number, a: any) => s + a.pct, 0)
                                acc.push({ pct, color: c.color, offset: prev })
                                return acc
                              }, []).map((seg: any, i: number) => {
                                const circumference = 2 * Math.PI * 78
                                return (
                                  <circle key={i} cx="95" cy="95" r="78" fill="none" stroke={seg.color} strokeWidth="20"
                                    strokeDasharray={`${seg.pct * circumference} ${circumference}`}
                                    strokeDashoffset={-seg.offset * circumference}
                                    strokeLinecap="round"
                                    transform="rotate(-90 95 95)"
                                    filter="url(#pieGlowC)" />
                                )
                              })}
                              <text x="95" y="90" textAnchor="middle" fill={constraintData[0]?.color || '#C8A24A'} fontSize="34" fontWeight="800">{constraintData[0]?.score}</text>
                              <text x="95" y="112" textAnchor="middle" fill="#777" fontSize="10" letterSpacing="1">PRIMARY</text>
                            </svg>
                            <div style={{ flex: 1 }}>
                              {constraintData.map((c: any, i: number) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c.color, boxShadow: `0 0 6px ${c.color}` }} />
                                  <div style={{ flex: 1, fontSize: '12px', color: '#e0e0e0', fontWeight: i===0?'700':'400' }}>{c.name}</div>
                                  <div style={{ fontSize: '13px', fontWeight: '800', color: c.color }}>{c.score}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* RADAR - severity dial gauge (better fit than degenerate polygon for 1-4 points) */}
                        {chartView === 'radar' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
                            <svg width="190" height="190" viewBox="0 0 190 190" style={{ flexShrink: 0 }}>
                              <defs>
                                <filter id="dialGlowC" x="-50%" y="-50%" width="200%" height="200%">
                                  <feGaussianBlur stdDeviation="5" result="b" />
                                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                              </defs>
                              <path d="M 30 140 A 75 75 0 1 1 160 140" fill="none" stroke="#1a1a1a" strokeWidth="16" strokeLinecap="round" />
                              <path d={`M 30 140 A 75 75 0 ${(constraintData[0]?.score || 0) > 50 ? 1 : 0} 1 ${95 + 75 * Math.cos(Math.PI - (Math.PI * (constraintData[0]?.score || 0) / 100))} ${140 - 75 * Math.sin(Math.PI - (Math.PI * (constraintData[0]?.score || 0) / 100))}`}
                                fill="none" stroke={constraintData[0]?.color || '#C8A24A'} strokeWidth="16" strokeLinecap="round" filter="url(#dialGlowC)" />
                              <text x="95" y="110" textAnchor="middle" fill={constraintData[0]?.color || '#C8A24A'} fontSize="38" fontWeight="800">{constraintData[0]?.score}</text>
                              <text x="95" y="132" textAnchor="middle" fill="#777" fontSize="10" letterSpacing="1">SEVERITY</text>
                              <text x="30" y="160" textAnchor="middle" fill="#444" fontSize="9">0</text>
                              <text x="160" y="160" textAnchor="middle" fill="#444" fontSize="9">100</text>
                            </svg>
                            <div style={{ flex: 1 }}>
                              {constraintData.map((c: any, i: number) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.color, boxShadow: `0 0 6px ${c.color}` }} />
                                  <div style={{ flex: 1, fontSize: '12px', color: '#ccc', fontWeight: i === 0 ? '700' as const : '400' as const }}>{c.name}</div>
                                  <div style={{ fontSize: '13px', fontWeight: '800', color: c.color }}>{c.score}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PILLAR CHART */}
                    {health.pillars && Object.keys(health.pillars).length > 0 && (
                      <div style={{ padding: '24px 28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', marginBottom: '20px', overflow: 'hidden' as const }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.2em', fontWeight: '600' }}>PILLAR SCORES — {industryLabel.toUpperCase()}</div>
                          <div style={{ fontSize: '9px', color: '#555' }}>/ 20 · WHITE = BENCHMARK</div>
                        </div>
                        {/* BAR - thicker glowing bars with benchmark tick */}
                        {chartView === 'bar' && (
                          <div>
                            {pillarData.map((p: any, i: number) => (
                              <div key={i} style={{ marginBottom: i === pillarData.length - 1 ? 0 : '18px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                                  <div style={{ fontSize: '12px', color: '#ccc', fontWeight: '500' as const }}>{p.name}</div>
                                  <div style={{ fontSize: '11px', color: '#555' }}>BM {p.benchmark} &nbsp;<span style={{ fontWeight: '800', color: p.color, fontSize: '13px' }}>{p.score}/20</span></div>
                                </div>
                                <div style={{ height: '16px', backgroundColor: '#0a0a0a', borderRadius: '8px', overflow: 'hidden', position: 'relative' as const, border: `1px solid ${border}` }}>
                                  <div style={{ width: `${(p.score/20)*100}%`, height: '100%', background: `linear-gradient(90deg, ${p.color}55, ${p.color})`, borderRadius: '8px', transition: 'width 1s ease', boxShadow: `0 0 10px ${p.color}77` }} />
                                  <div style={{ position: 'absolute' as const, top: '-2px', left: `${(p.benchmark/20)*100}%`, width: '3px', height: '20px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '2px' }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* COLUMN - gradient columns with glow + benchmark line */}
                        {chartView === 'column' && (
                          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '18px', height: '210px', paddingBottom: '30px', paddingTop: '8px', paddingLeft: '28px', position: 'relative' as const, overflow: 'hidden' as const }}>
                            {[0,5,10,15,20].map(line => (
                              <div key={line} style={{ position: 'absolute' as const, left: 0, right: 0, bottom: `${(line/20)*160+30}px`, borderTop: '1px solid #1a1a1a', pointerEvents: 'none' as const }}>
                                <span style={{ position: 'absolute' as const, left: '4px', fontSize: '9px', color: '#555', top: '-6px' }}>{line}</span>
                              </div>
                            ))}
                            {pillarData.map((p: any, i: number) => (
                              <div key={i} style={{ width: '64px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '6px', position: 'relative' as const, zIndex: 1 }}>
                                <div style={{ fontSize: '12px', fontWeight: '800', color: p.color }}>{p.score}</div>
                                <div style={{ width: '70%', position: 'relative' as const }}>
                                  <div style={{ width: '100%', height: `${(p.score/20)*160}px`, background: `linear-gradient(180deg, ${p.color}, ${p.color}44)`, borderRadius: '8px 8px 3px 3px', transition: 'height 1s ease', minHeight: '3px', boxShadow: `0 0 14px ${p.color}66` }} />
                                  <div style={{ position: 'absolute' as const, left: '-12%', right: '-12%', bottom: `${(p.benchmark/20)*160}px`, borderTop: '2px dashed rgba(255,255,255,0.55)' }} />
                                </div>
                                <div style={{ fontSize: '9px', color: '#999', textAlign: 'center' as const }}>{p.name.slice(0,4)}</div>
                              </div>
                            ))}
                          </div>
                        )}
