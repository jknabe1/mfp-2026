import React from 'react'
import NewsletterSection from '../Newsletter/NewsletterSection'
import Link from 'next/link'

export default function Footer() {
  return (
    <div>
        <footer>
            <div className="overflow-hidden">
            <NewsletterSection />
                    <div className="grid grid-cols-12 gap-px relative">
                        <div className="col-span-12 grid-col-border lg:hidden">
                            <div>
                                <button className="p-2 text-left block w-full">
                                    <div className="w-full flex justify-between items-center">
                                        <div className="text-sans-35 font-600 tracking-tighter">Om oss</div>
                                    </div>
                                </button>
                                <div className="overflow-hidden">
                                    <div>
                                        <ul className="flex flex-col gap-px border-t border-solid">
                                            <li className="grid-col-border">
                                                <Link className="block w-full text-sans-14 uppercase tracking-wider p-2 text-left" title="Om oss" aria-label="Om oss" href="/om-oss/">Om oss</Link>
                                            </li>
                                            <li className="grid-col-border">
                                                <Link className="block w-full text-sans-14 uppercase tracking-wider p-2 text-left" title="CONTACT" aria-label="CONTACT" href="/om-oss/kontakta-oss">Kontakta oss</Link>
                                            </li>
                                            <li className="grid-col-border">
                                                <Link className="block w-full text-sans-14 uppercase tracking-wider p-2 text-left" title="integritet" aria-label="integritet" href="/om-oss/integritet">integritet</Link>
                                            </li>
                                            <li className="grid-col-border">
                                                <Link className="block w-full text-sans-14 uppercase tracking-wider p-2 text-left" title="Tillgänglighet" aria-label="Tillgänglighet" href="/om-oss/tillganglighet">Tillgänglighet</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 grid-col-border lg:hidden">
                            <div>
                                <button className="p-2 text-left block w-full">
                                    <div className="w-full flex justify-between items-center">
                                        <div className="text-sans-35 font-600 tracking-tighter">Genvägar</div>
                                    </div>
                                </button>
                            <div className="overflow-hidden">
                                <div>
                                    <ul className="flex flex-col gap-px border-t border-solid">
                                        <li className="grid-col-border">
                                            <Link className="block w-full text-sans-14 uppercase tracking-wider p-2 text-left" title="Artister" aria-label="Artister" href="/arrangemang">Arrangemang</Link>
                                        </li>
                                        <li className="grid-col-border">
                                            <Link className="block w-full text-sans-14 uppercase tracking-wider p-2 text-left" title="Föreningar" aria-label="Föreningar" href="/foreningar">Föreningar</Link>
                                        </li>
                                        <li className="grid-col-border">
                                            <Link className="block w-full text-sans-14 uppercase tracking-wider p-2 text-left" title="Edits" aria-label="Edits" href="/edits">Edits</Link>
                                        </li>
                                        <li className="grid-col-border">
                                            <Link className="block w-full text-sans-14 uppercase tracking-wider p-2 text-left" title="Event" aria-label="Event" href="/event">Event</Link>
                                        </li>
                                        <li>
                                            <Link className='block w-full text-sans-14 uppercase tracking-wider p-2 text-left' title="Backstage" aria-label="Backstage" href="/backstage">Backstage</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 grid-col-border lg:hidden">
                        <div>
                            <button className="p-2 text-left block w-full">
                                <div className="w-full flex justify-between items-center">
                                    <div className="text-sans-35 font-600 tracking-tighter">Socials</div>
                                </div>
                            </button>
                            <div className="overflow-hidden">
                                <div>
                                    <ul className="flex flex-col gap-px border-t border-solid">
                                        <li className="grid-col-border">
                                            <Link className="block w-full text-sans-14 uppercase tracking-wider p-2 text-left" title="Instagram" aria-label="Instagram" href="https://www.instagram.com/musicforpennies.se">Instagram</Link>
                                        </li>
                                        <li className="grid-col-border">
                                            <Link className="block w-full text-sans-14 uppercase tracking-wider p-2 text-left" title="Facebook" aria-label="Facebook" href="https://www.facebook.com/kkmusicrecords">Facebook</Link>
                                        </li>
                                        <li className="grid-col-border">
                                            <Link className='block w-full text-sans-14 uppercase tracking-wider p-2 text-left' title="TikTok" aria-label="TikTok" href="https://www.tiktok.com/@kkrecordssweden">TikTok</Link>
                                        </li>
                                        <li className="grid-col-border">
                                            <Link className="block w-full text-sans-14 uppercase tracking-wider p-2 text-left" title="Spotify" aria-label="Spotify" href="https://open.spotify.com/user/rp0di7du2vijxmhev2mp6vugo">Spotify</Link>
                                        </li>
                                        <li className="grid-col-border">
                                            <Link className="block w-full text-sans-14 uppercase tracking-wider p-2 text-left" title="Youtube" aria-label="Youtube" href="https://www.youtube.com/@kkrec">Youtube</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 grid-col-border p-2 py-3 lg:hidden">
                        <div className="flex gap-2 items-center">
                            
                                <div className="block text-sans-12 uppercase tracking-wider link-primary">Skapad av:</div>
                                <Link href="https://www.kkmedia.se" className="text-sans-12 uppercase tracking-wider">K&K Media Group Sweden AB</Link>
                            </div>
                        </div>
                        <div className="col-span-4 grid-col-border p-4 xl:p-5 hidden lg:block min-h-[420px] relative">
                            <h2 className="text-sans-60 font-600 mb-2 tracking-tighter ml-[-0.08em]">Om oss</h2>
                            <ul>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="Om oss" aria-label="Om oss" href="/om-oss/">Om oss</Link>
                                </li>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="Kontakta oss" aria-label="Kontakta oss" href="/om-oss/kontakta-oss">Kontakta oss</Link>
                                </li>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="Integritet" aria-label="Integritet" href="/om-oss/integritet">Integritet</Link>
                                </li>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="Tillgänglighet" aria-label="Tillgänglighet" href="/om-oss/tillganglighet">Tillgänglighet</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-4 grid-col-border p-4 xl:p-5 hidden lg:block min-h-[420px] relative">
                            <h2 className="text-sans-60 font-600 mb-2 tracking-tighter ml-[-0.08em]">Genvägar</h2>
                            <ul>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="Arrangemang" aria-label="Arrangemang" href="/arrangemang">Arrangemang</Link>
                                </li>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="Föreningar" aria-label="Föreningar" href="/foreningar">Föreningar</Link>
                                </li>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="Edits" aria-label="Edits" href="/edits">Edits</Link>
                                </li>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="Event" aria-label="Event" href="/event">Event</Link>
                                </li>
                                <li>
                                    <Link className='inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1' title="Backstage" aria-label="Backstage" href="/backstage">Backstage</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-4 grid-col-border p-4 xl:p-5 hidden lg:block min-h-[420px] relative">
                            <h2 className="text-sans-60 font-600 mb-2 tracking-tighter ml-[-0.08em]">Socials</h2>
                            <ul>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="Instagram" aria-label="Instagram" href="https://www.instagram.com/musicforpennies.se">Instagram</Link>
                                </li>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="Facebook" aria-label="Facebook" href="https://www.facebook.com/kkmusicrecords">Facebook</Link>
                                </li>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="TikTok" aria-label="TikTok" href="https://www.tiktok.com/@kkrecordssweden">TikTok</Link>
                                </li>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="Spotify" aria-label="Spotify" href="https://open.spotify.com/user/rp0di7du2vijxmhev2mp6vugo">Spotify</Link>
                                </li>
                                <li>
                                    <Link className="inline-block text-sans-16 uppercase tracking-wider font-800 link-primary pb-1" title="Youtube" aria-label="Youtube" href="https://www.youtube.com/@kkrec">Youtube</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 grid-col-border p-2 py-3 lg:block hidden">
                        <div className="flex gap-2 items-center">
                            
                                <div className="block text-sans-14 uppercase tracking-wider link-primary">Skapad av:</div>
                                <Link href="https://www.kkmedia.se" className="text-sans-14 uppercase tracking-wider">K&K Media Group Sweden AB</Link>
                            </div>
                        </div>
            </footer>
    </div>
  )
}
