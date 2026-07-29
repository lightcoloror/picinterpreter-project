# Commercial AAC Business Model Benchmark

Last updated: 2026-06-08

This document summarizes public evidence about mature AAC products' business models, pricing, payer channels, support models, and revenue visibility.

It is not an investment analysis and does not estimate revenue where no reliable source is available. For Tuyujia, the purpose is to understand which monetization paths are real in the AAC market and which assumptions need validation before building paid infrastructure.

## Evidence Rules

AAC vendors are unevenly transparent. Only a few have public financial reports. Most are private companies, so their revenue is not directly knowable from public sources.

Evidence levels used below:

| Level | Meaning | Examples |
|---|---|---|
| High | Official financial report, statutory account, official product/pricing page, app store listing, government procurement or funding page | Dynavox annual report, App Store price, official funding pages |
| Medium | Official page confirms business model but not revenue, or statutory/third-party account gives partial data | private company funding page, Companies House-derived summaries |
| Low | Third-party revenue estimates, profile aggregators, forums, anecdotal procurement comments | Growjo, Owler, Prospeo, Reddit |

Rule for this document:

- Do not treat third-party revenue estimates as facts.
- Do not infer a vendor's total revenue from app price or app ranking alone.
- Separate "pricing evidence" from "revenue evidence".
- Separate "family self-pay" from "school / institution / insurance-funded" channels.

## Main Takeaway

Mature AAC companies rarely survive on ordinary family subscriptions alone.

The durable revenue paths are:

- insurance / Medicare / Medicaid / VA funded dedicated speech-generating devices
- school, district, hospital, therapy-center, and institutional procurement
- app subscriptions or one-time app purchases
- training, onboarding, technical support, funding assistance, device trials, and repair/warranty services
- hosted cloud or collaboration features for teams and caregivers

For Tuyujia, this suggests a more realistic path than "family subscription only":

> open-source / local-first core communication + low-cost family cloud + therapist / institution plan + paid deployment, training, and customization.

## Comparison Table

| Company / product | Revenue sources | Payers | Public price | Insurance / school / institution channel | Subscription | Training / support | Public revenue | Evidence links | Confidence |
|---|---|---|---|---|---|---|---|---|---|
| Dynavox Group / Tobii Dynavox | Dedicated AAC devices, TD Snap, Boardmaker, accessories, support and services | Insurance, schools, families, institutions | TD Snap iPad subscription; institutional / enterprise purchase path | Strong insurance, school, and institution channel | Yes | Support, cloud sync, training resources | 2025 revenue SEK 2.467B | [Dynavox 2025 year-end report](https://mfn.se/cis/a/dynavox-group/dynavox-group-year-end-report-2025-e1d8d336.iframe), [TD Snap product page](https://us.tobiidynavox.com/products/td-snap), [TD Snap App Store](https://apps.apple.com/us/app/td-snap/id1072799231) | High |
| Smartbox / Grid | Grid software, Grid for iPad, Grid Pad devices, education licenses, support | Families, schools, hospitals, institutions | Grid for iPad has monthly subscription and one-off purchase paths; VPP / OAP / Smartbox Account licensing | Strong school and institution channel | Yes, also one-off / OAP / VPP | Smartbox Hub, Smartbox Academy, technical support | Smartbox UK 2024 turnover around GBP 21.48M in Companies House-derived summaries; group-level turnover may differ | [Grid for iPad App Store](https://apps.apple.com/gb/app/grid-for-ipad-aac/id1064332378), [Grid for iPad versions](https://hub.thinksmartbox.com/knowledgebase/grid-for-ipad-versions/), [192 / Companies House-derived summary](https://www.192.com/atoz/financial/business/05541084/) | Medium-high |
| PRC-Saltillo / TouchChat / LAMP / Accent | Dedicated SGD devices, TouchChat, LAMP Words for Life, vocabulary / symbol IAP, iShare | Insurance, schools, families, SLPs, institutions | TouchChat with WordPower USD 299.99; LAMP Words for Life USD 299.99; PCS USD 49.99; iShare individual USD 59.99 / team USD 239.99 | Device side strongly uses Medicare / Medicaid / insurance; app side also school and family purchase | App mainly one-time purchase; iShare is subscription | Funding team, training, device support | Private company; no reliable public revenue | [TouchChat App Store](https://apps.apple.com/us/app/touchchat-hd-aac-w-wordpower/id412351574), [LAMP App Store](https://apps.apple.com/us/app/lamp-words-for-life/id551215116), [Saltillo funding](https://saltillo.com/funding) | Medium-high |
| AssistiveWare / Proloquo2Go / Proloquo | App purchases, subscriptions, school licenses, vocabulary IAP | Families, schools, therapists | Proloquo2Go USD 249.99; Gateway USD 149.99; Proloquo USD 9.99/month or USD 99.99/year | School licenses; Proloquo points users to AbleNet for insurance / device path | Proloquo is subscription; Proloquo2Go is one-time purchase | Proloquo Coach, support, AAC learning resources | Private company; no reliable public revenue | [Proloquo2Go App Store](https://apps.apple.com/us/app/proloquo2go-aac/id308368164), [Proloquo pricing](https://www.assistiveware.com/products/proloquo), [Proloquo school licenses](https://www.assistiveware.com/products/proloquo-school-licenses) | Medium-high |
| Avaz AAC | App subscription, lifetime purchase, school VPP, institutional demos | Families, schools, therapy centers | USD 9.99/month, USD 99.99/year, USD 199.99 lifetime; lifetime App Store listing may vary by storefront | School VPP discount for 20+ copies; institutional page exists; not primarily an insurance device vendor | Yes, also lifetime | Built-in tutorial, Avaz Dashboard, institution onboarding | Private company; no reliable public revenue | [Avaz price FAQ](https://avazapp.freshdesk.com/support/solutions/articles/1000172730-what-is-the-price-of-avaz-how-much-does-avaz-cost-), [Avaz App Store](https://apps.apple.com/us/app/avaz-aac-lifetime-edition/id558161781), [Avaz institutions](https://www.avazapp.com/institutions) | Medium-high |
| CoughDrop | Per-communicator account, supporter / demo accounts, premium symbols, public board design | Families, schools, therapists, institutions | USD 9/month; USD 295 lifetime; supporter / demo USD 45; premium symbols USD 45 | Accepts purchase orders, group rates, funding paths; also connects with Forbes AAC | Yes, also lifetime | Supervisor accounts, modeling accounts, AAC resources, board design | Private / small organization; no reliable public revenue | [CoughDrop pricing](https://coughdrop.zendesk.com/hc/en-us/articles/201366609-How-much-does-CoughDrop-cost), [funding options](https://coughdrop.zendesk.com/hc/en-us/articles/115002655512-What-pricing-options-and-funding-opportunities-are-available-to-purchase-CoughDrop), [public communication boards](https://www.coughdrop.com/aac-communication-boards) | Medium-high |
| Cboard | Open-source free tier plus Pro hosted subscription | Families, schools, individual users | Free; Pro USD 8/month or USD 79/year | More like open-source SaaS than insurance-funded SGD path | Yes | Pro includes private support channel | No public revenue found | [Cboard pricing](https://www.cboard.io/es/pricing/), [Cboard help / pricing](https://www.cboard.io/help), [Cboard GitHub wiki](https://github.com/cboard-org/cboard/wiki) | Medium |
| Lingraphica | Dedicated AAC devices, insurance-funded SGD pathway, free SmallTalk / TalkPath ecosystem | Adult aphasia users, SLPs, caregivers, insurance | Price usually goes through insurance / estimate; no direct consumer list price confirmed | Strong Medicare, Medicaid, VA, and private insurance path | Not primarily a consumer app subscription model | Free device trial, lifetime support, SLP education | Private company; Growjo-style estimates exist but should be treated as low-confidence | [Lingraphica Medicare](https://lingraphica.com/medicare/), [funding overview](https://lingraphica.com/how-lingraphica-aac-device-funding-works/), [About Lingraphica](https://lingraphica.com/about-lingraphica/) | Medium |
| AbleNet / QuickTalker Freestyle | Dedicated SGD device, insurance funding, device and support services | Insurance, families, SLPs, schools | Direct retail price not clearly public; process begins with benefit check / insurance | Strong DME / insurance funding path | Not mainly app subscription | Benefit check, funding team, ableCARE support | Private company; third-party estimates only | [QuickTalker funding support](https://quicktalkerfreestyle.com/funding-support/), [AbleNet funding FAQ](https://support.ablenetinc.com/funding-for-quicktalker-freestyle/ableexperience/ableexperience-faq/) | Medium |
| Talk To Me Technologies / Wego / Grid Pad / Talk Pad | Dedicated SGD devices, eye gaze devices, accessories, insurance funding service | Medicare, Medicaid, commercial insurance, schools, families | Wego / Talk Pad from USD 7,995; Grid Pad from USD 8,495; eye gaze devices from USD 16,395 | Strong Medicare / Medicaid / commercial insurance path | Device sales and services rather than simple app subscription | AAC consultants, device loan, funding service | Private company; third-party estimates only | [Talk To Me funding and product pricing](https://www.talktometechnologies.com/pages/funding), [BBB profile](https://www.bbb.org/us/ia/cedar-falls/profile/communication-devices/talk-to-me-technologies-llc-0664-32099318) | Medium |
| Forbes AAC | ProSlate / WinSlate devices, CoughDrop / CoreWord / Spark software, accessories, funding services | Insurance, SLPs, schools, families | Prices not fully public; often quote / funding based | Strong Medicare / Medicaid / private insurance path | Device + software bundle model | Funding specialists, loan library, CEUs, technical support | Private company; no reliable public revenue | [Forbes AAC About](https://www.forbesaac.com/about-us), [Forbes AAC products and funding](https://www.forbesaac.com/), [Funding portal](https://portal.forbesaac.com/), [AAC Now](https://www.forbesaac.com/aac-now) | Medium |

## Patterns Across Mature AAC Vendors

### 1. Dedicated devices are a separate business model from apps

Device vendors are not just selling an iPad-like screen. They are selling:

- medical-device-like speech-generating devices
- funding paperwork support
- insurance / Medicare / Medicaid / VA claim handling
- warranty, repair, mounting, access method, and technical support
- clinician-facing training and evaluation workflows

This explains why SGD vendors can charge thousands of dollars through funding channels while standalone apps are usually priced from low monthly subscriptions to a few hundred dollars one-time.

### 2. Subscription is growing, but controversial

TD Snap and Proloquo show that subscriptions are becoming more common in serious AAC apps. Cboard and CoughDrop also use low monthly subscriptions.

However, AAC is ethically sensitive. If speech output disappears when payment fails, users and clinicians may perceive the model as exploitative. A safer design principle for Tuyujia is:

> Never put essential offline communication behind a recurring payment failure path.

Paid plans should emphasize cloud sync, AI usage, caregiver collaboration, institution management, training, and support rather than disabling basic communication.

### 3. Institution and clinician channels matter more than cold consumer acquisition

AAC adoption is often mediated by:

- speech-language pathologists
- special education teachers
- rehabilitation hospitals
- school districts
- insurance / funding specialists
- families and caregivers

For Tuyujia, this means pure consumer marketing is likely inefficient. A better early route is therapist / hospital / school / rehab-center validation, then family adoption through trusted professionals.

### 4. Support and onboarding are part of the product

Mature vendors sell more than software:

- training cards and webinars
- funding support
- free trials / loan devices
- school licensing
- cloud backup
- remote editing
- technical support
- printed low-tech resources

For Tuyujia, this points to service revenue as a real option:

- board customization for a patient or ward
- caregiver onboarding
- clinician template setup
- local deployment
- data backup and migration
- printed communication books and QR-linked boards

## Implications For Tuyujia

### What should stay free / open

The core communication right should remain protected:

- local board usage
- basic pictogram communication
- printable / offline fallback
- self-hostable open-source base
- basic Chinese adult AAC vocabulary

This aligns with the project's ethical positioning and avoids copying the most controversial part of AAC subscriptions.

### What can reasonably be paid

Paid features should be framed as hosting, collaboration, intelligence, and service:

- cloud account, backup, and cross-device sync
- caregiver / therapist collaboration
- AI sentence generation quota
- speech-to-picto and text-to-picto usage quota
- personal image library sync
- institution template management
- usage review / correction analytics
- private deployment
- training, customization, and support

### More realistic pricing direction

The benchmark suggests three levels rather than one consumer subscription:

| Plan | Possible payer | Directional price logic |
|---|---|---|
| Free local core | Families, open-source users | Must remain usable without payment |
| Family cloud / AI plan | Families who need backup, AI, multi-caregiver use | Low monthly / annual subscription; AI quota capped |
| Therapist / institution plan | Therapists, rehab departments, schools, nursing facilities | Seat / client / site-based annual fee plus support |
| Service / deployment | Hospitals, schools, foundations, research projects | Project fee for setup, customization, training, or private deployment |

The first paid money is more likely to come from an institution pilot, service project, school / hospital collaboration, or funded research project than from hundreds of individual families subscribing on day one.

## Open Questions For Further Validation

- In China, which payer is realistic first: family self-pay, hospital department, rehabilitation center, school / special education institution, foundation, or government procurement?
- Would therapists pay personally, or only institutions?
- Would families pay for AI sentence generation, cloud backup, or caregiver collaboration?
- Is a hospital / school willing to pay for setup and training if the software itself is open source?
- What support burden appears after 10 real families use the system for two weeks?
- What parts must remain local-only because of privacy and trust?

## Recommended Next Step

Before building a full account system, payment system, AI quota system, and operations team, run a paid-pilot validation:

1. Offer a free local demo and one-page pilot proposal.
2. Ask 3-5 therapists / rehab teachers whether they would support a small institution pilot.
3. Ask 5-10 families what they would pay for: cloud backup, AI generation, personal images, training, or printed boards.
4. Try to obtain one of these commitments:
   - a small paid pilot
   - a formal institutional trial
   - a research / student project collaboration
   - a signed feedback agreement
5. Only then decide whether to build production accounts, billing, and paid AI infrastructure.

## Sources To Re-check Periodically

| Source type | Where to check |
|---|---|
| Public company financials | Dynavox Group investor relations, annual reports, quarterly reports |
| Private UK company accounts | UK Companies House and Companies House-derived summaries |
| App pricing | Apple App Store, Google Play, official pricing pages |
| Insurance / SGD funding paths | Medicare / Medicaid / VA guidance, vendor funding pages, CMS SGD coverage rules |
| School / institution procurement | official institution license pages, public procurement portals |
| Open-source SaaS funding | Cboard pricing, OpenCollective if available, GitHub sponsors if available |
| Low-confidence revenue estimates | Growjo, Owler, Prospeo, Crunchbase, CB Insights; use only as weak signals |
