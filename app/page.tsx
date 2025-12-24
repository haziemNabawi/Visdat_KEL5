'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts'

interface SummaryData {
  total_benefits: {
    value: number
    formatted: string
  }
  total_areas: number
  air_quality: {
    total: number
    percentage: number
  }
  co_benefits: Array<{
    id: string
    name: string
    total: number
    percentage: number
  }>
}

export default function Home() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null)
  const [regionalData, setRegionalData] = useState<any[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [animatedData, setAnimatedData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    Promise.all([
      fetch('/data/summary_data.json').then(r => r.json()),
      fetch('/data/regional_detailed.json').then(r => r.json()),
      fetch('/data/animated_timeline.json').then(r => r.json())
    ])
    .then(([summary, regional, animated]) => {
      setSummaryData(summary)
      setRegionalData(regional)
      setAnimatedData(animated)
      setLoading(false)
    })
  }, [])

  const scrollToNextSection = () => {
    const windowHeight = window.innerHeight
    window.scrollTo({
      top: windowHeight,
      behavior: 'smooth'
    })
  }

  if (loading || !summaryData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    )
  }

  const chartData = summaryData.co_benefits.slice(0, 6).map((item) => ({
    name: item.name,
    value: item.total
  }))

  const benefitsData = [
    {
      title: 'Cleaner Air',
      value: `£${(summaryData.air_quality.total / 1000).toFixed(1)}B`,
      subtitle: '33% of total value',
      description: 'Reduced air pollution leads to fewer respiratory illnesses and hospital visits.'
    },
    {
      title: 'Active Living',
      value: `£${(summaryData.co_benefits.find(b => b.id === 'physical_activity')?.total || 0 / 1000).toFixed(1)}B`,
      subtitle: 'Walking & cycling',
      description: 'More walking and cycling means healthier communities and lower healthcare costs.'
    },
    {
      title: 'Comfortable Homes',
      value: `£${((summaryData.co_benefits.find(b => b.id === 'excess_cold')?.total || 0) / 1000).toFixed(1)}B`,
      subtitle: 'Energy efficiency',
      description: 'Better insulation keeps homes warmer in winter, reducing heating bills.'
    },
    {
      title: 'Quieter Streets',
      value: `£${(Math.abs(summaryData.co_benefits.find(b => b.id === 'noise')?.total || 0) / 1000).toFixed(1)}B`,
      subtitle: 'Noise reduction',
      description: 'Less traffic noise improves sleep quality and mental wellbeing.'
    }
  ]

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Hero Section - Dark Mode */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-light text-white leading-tight">
            Cleaner Air,<br />
            <span className="font-semibold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Healthier Lives</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light">
            How climate action quietly creates real economic value through better air quality.
          </p>
          <div className="pt-8">
            <p className="text-sm text-gray-500 mb-4">Scroll to explore how these benefits appear across the UK.</p>
            <button 
              onClick={scrollToNextSection}
              className="inline-block animate-bounce hover:text-blue-400 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-950 rounded-full p-2"
              aria-label="Scroll to next section"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Big Numbers Section - Dark */}
      <section className="py-32 px-6 bg-gray-900 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-16 text-center">
            What drives the economic value
          </h2>
          <p className="text-xl text-gray-400 text-center mb-20 max-w-3xl mx-auto font-light">
            Economic value flows from everyday changes in how we breathe, move, and live.
          </p>
          
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="text-5xl md:text-6xl font-light text-white">
                £{(summaryData.total_benefits.value / 1000).toFixed(1)}B
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Total Economic Value</div>
              <div className="text-base text-gray-400 font-light">2025-2050</div>
            </div>
            
            <div className="space-y-4">
              <div className="text-5xl md:text-6xl font-light bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {summaryData.air_quality.percentage.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">From Cleaner Air</div>
              <div className="text-base text-gray-400 font-light">Largest single benefit</div>
            </div>
            
            <div className="space-y-4">
              <div className="text-5xl md:text-6xl font-light text-white">
                {summaryData.total_areas.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Areas Covered</div>
              <div className="text-base text-gray-400 font-light">Across the UK</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive UK Map Visualization */}
      <section className="py-32 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
              Who benefits the most
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto">
              Climate action does not benefit everyone equally. Click on a region to explore the details.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* UK Map */}
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <h3 className="text-2xl font-light text-white mb-6">Regional Air Quality Benefits</h3>
              
              {/* Simple UK Map Representation */}
              <div className="space-y-4">
                {regionalData.map((region, idx) => {
                  const isSelected = selectedRegion === region.region
                  const maxValue = Math.max(...regionalData.map((r: any) => r.total_air_quality))
                  const barWidth = (region.total_air_quality / maxValue) * 100
                  
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">{region.region}</span>
                        <span className="text-blue-400 font-medium">
                          £{(region.total_air_quality / 1000).toFixed(1)}B
                        </span>
                      </div>
                      <div 
                        className={`h-12 rounded-lg cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                          isSelected ? 'ring-2 ring-blue-400' : ''
                        }`}
                        style={{
                          background: `linear-gradient(to right, #3b82f6 ${barWidth}%, #1f2937 ${barWidth}%)`
                        }}
                        onClick={() => setSelectedRegion(isSelected ? null : region.region)}
                      >
                        <div className="absolute inset-0 flex items-center px-4">
                          <span className="text-white font-medium text-sm group-hover:text-yellow-300 transition-colors">
                            {region.area_count.toLocaleString()} areas
                          </span>
                        </div>
                        {!isSelected && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Region Details */}
            <div className="space-y-6">
              {selectedRegion ? (
                <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 animate-fadeInUp">
                  {(() => {
                    const region = regionalData.find((r: any) => r.region === selectedRegion)
                    if (!region) return null
                    
                    return (
                      <>
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="text-3xl font-light text-white">{region.region}</h3>
                          <button 
                            onClick={() => setSelectedRegion(null)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                          <div className="space-y-2">
                            <div className="text-4xl font-light text-blue-400">
                              £{(region.total_air_quality / 1000).toFixed(2)}B
                            </div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Air Quality Value</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-4xl font-light text-white">
                              {region.area_count.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Areas Covered</div>
                          </div>
                        </div>

                        <div className="border-t border-gray-800 pt-6">
                          <h4 className="text-lg font-light text-white mb-4">Top Performing Areas</h4>
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {region.top_areas.slice(0, 8).map((area: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">
                                  {area.display_name || area.small_area}
                                </span>
                                <span className="text-green-400 font-medium">
                                  £{area.air_quality.toFixed(2)}M
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🗺️</div>
                    <p className="text-gray-400">Click on a region to explore detailed benefits</p>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-900/30 to-green-900/30 rounded-2xl p-6 border border-blue-800/30">
                <h4 className="text-sm uppercase tracking-wider text-blue-400 mb-4">Quick Stats</h4>
                <div className="space-y-3">
                  {regionalData.slice(0, 3).map((region, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{region.region}</span>
                      <span className="text-sm text-white font-medium">
                        £{(region.avg_per_area).toFixed(2)}M avg/area
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Animated Visualization */}
      <section className="py-32 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
              Air quality improvements over time
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto">
              Projected cumulative benefits from 2025 to 2050 under net zero pathways.
            </p>
          </div>

          {/* Animated Line Chart */}
          <div className="bg-gray-950 rounded-2xl p-12 border border-gray-800">
            <ResponsiveContainer width="100%" height={500}>
              <AreaChart data={animatedData}>
                <defs>
                  {animatedData.length > 0 && (() => {
                    const palette = ['#3b82f6', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ef4444', '#f97316']
                    return animatedData[0].benefits.map((b: any, i: number) => (
                      <linearGradient key={i} id={`color-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={palette[i % palette.length]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={palette[i % palette.length]} stopOpacity={0}/>
                      </linearGradient>
                    ))
                  })()}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={{ stroke: '#4b5563' }}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={{ stroke: '#4b5563' }}
                  label={{ value: 'Million GBP', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                {animatedData.length > 0 && (() => {
                  const palette = ['#3b82f6', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ef4444', '#f97316']
                  return animatedData[0].benefits.map((benefit: any, idx: number) => (
                    <Area
                      key={idx}
                      type="monotone"
                      dataKey={`benefits[${idx}].value`}
                      stroke={palette[idx % palette.length]}
                      fillOpacity={1}
                      fill={`url(#color-${idx})`}
                      animationDuration={2000}
                    />
                  ))
                })()} 
              </AreaChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-6 justify-center">
              {animatedData.length > 0 && (() => {
                const palette = ['#3b82f6', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ef4444', '#f97316']
                return animatedData[0].benefits.map((benefit: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: palette[idx % palette.length] }}
                    />
                    <span className="text-sm text-gray-400">{benefit.name}</span>
                  </div>
                ))
              })()}
            </div>
          </div>

          {/* Additional Modern Viz - Radial Progress */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {summaryData.co_benefits.slice(0, 3).map((benefit, idx) => {
              const percentage = benefit.percentage
              const circumference = 2 * Math.PI * 70
              const dashOffset = circumference - (percentage / 100) * circumference
              
              return (
                <div key={idx} className="bg-gray-950 rounded-2xl p-8 border border-gray-800 text-center">
                  <div className="relative inline-block mb-6">
                    <svg width="160" height="160" className="transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#1f2937"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#3b82f6"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-light text-white">
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <h4 className="text-lg font-light text-white mb-2">
                    {benefit.name}
                  </h4>
                  <p className="text-2xl font-light text-blue-400">
                    £{(benefit.total / 1000).toFixed(1)}B
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Daily Impact Section - Dark */}
      <section className="py-32 px-6 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
            Better lives, every day
          </h2>
          <p className="text-xl text-gray-400 mb-20 font-light max-w-2xl">
            Cleaner air is not just about the future. The benefits show up in how we live today.
          </p>

          <div className="space-y-16">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="text-6xl mb-4">😴</div>
                <h3 className="text-2xl font-light text-white mb-2">Better sleep</h3>
                <div className="h-1 w-20 bg-blue-500 mb-4"></div>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-gray-400 font-light leading-relaxed">
                  Less air pollution means fewer respiratory problems at night. Better breathing leads to deeper, 
                  more restful sleep. The value? £{(summaryData.air_quality.total / 1000).toFixed(1)}B in health improvements.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="md:w-1/3">
                <div className="text-6xl mb-4">🏃</div>
                <h3 className="text-2xl font-light text-white mb-2">More active lives</h3>
                <div className="h-1 w-20 bg-green-500 mb-4"></div>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-gray-400 font-light leading-relaxed">
                  When air quality improves, people naturally spend more time outdoors. Walking, cycling, 
                  and outdoor activities increase, bringing both health and social benefits.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-2xl font-light text-white mb-2">Healthcare savings</h3>
                <div className="h-1 w-20 bg-purple-500 mb-4"></div>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-gray-400 font-light leading-relaxed">
                  Cleaner air reduces hospital visits, medication costs, and days off work. 
                  These savings add up to significant economic value for communities and families.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Dark */}
      <section className="py-32 px-6 bg-gradient-to-b from-gray-900 to-black text-white border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-5xl font-light leading-tight">
            Cleaner air is an investment<br />in better lives
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 py-12">
            <div>
              <div className="text-5xl font-light mb-3">£{(summaryData.total_benefits.value / 1000).toFixed(0)}B</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Total National Value</div>
            </div>
            <div>
              <div className="text-5xl font-light mb-3 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {summaryData.air_quality.percentage.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Driven by Air Quality</div>
            </div>
            <div>
              <div className="text-5xl font-light mb-3">46K</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Communities Benefit</div>
            </div>
          </div>

          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Climate action is often framed as a cost. But cleaner air delivers economic value by making 
            everyday life healthier, more comfortable, and more liveable.
          </p>
        </div>
      </section>

      {/* Footer - Dark */}
      <footer className="bg-black text-gray-500 py-16 px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-white text-lg font-light mb-4">About This Project</h3>
              <p className="text-sm font-light leading-relaxed">
                This visualization is part of The Data Lab Data Visualisation Competition 2025, 
                exploring the co-benefits of climate action through the UK Co-Benefits Atlas dataset.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-light mb-4">Team</h3>
              <p className="text-sm font-light">
                Kelompok 5 - Telkom University<br />
                Rafi Aqil Kukuh Daffana<br />
                M. Haziem Nabawi<br />
                Tegar Aqil Gunawan
              </p>
            </div>
          </div>
          <div className="border-t border-gray-900 pt-8 text-center text-sm space-y-2">
            <p>
              Data Source:{' '}
              <a 
                href="https://drive.google.com/drive/folders/1-tOEPj2qXFjL_zlr7pmovpzMAAoJnM95?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline transition-colors cursor-pointer inline-block"
              >
                UK Co-Benefits Atlas - Edinburgh Climate Change Institute (ECCI)
              </a>
            </p>
            <p className="mt-2">© 2025 Data Visualisation Competition</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
