# TrustSight: EigenTrust-powered Web3 Reputation Crowdsourcing Platform

This project was built specifically for the 2023 ETHDenver #BUIDLATHON.

- Watch the demo video: https://www.youtube.com/watch?v=836ZXyB3yRY

## Introduction

![](/landing.png)

TrustSight is an EigenTrust-powered Web3 Reputation Crowdsourcing Platform

## Problem Statement
One of the largest problems in web3 is how difficult it is to identify legitimate actors and avoid malicious actors on-chain. If I’m a new user, where would I go to find the best DeFi, NFT, or DAO projects? Or how do I know if this contract I’m about to interact with is legitimate and not a scam? 

Experienced users might check etherscan for metrics like TVL or get an expert friend’s opinion, but that’s a big ask for beginners. And often the reason why they fall for frequent scams, rugpulls, and phishing schemes.

So the questions are:

1. How can we as a community collectively assess the legitimacy of accounts and contracts?

2. How can we provide a seamless UX to showcase this “legitimacy” especially for beginner users?

## Solution
This is why we’ve built TrustSight, a platform to crowdsource reputation for on-chain actors.

TrustSight works in the following manner:

1. We crowdsource trust scores from users about others through the Optimism attestation framework.

2. We run a simple, non-distributed EigenTrust algorithm to compute a global trust score for all actors in a network.

3. We showcase these scores through a seamless, beginner-friendly UI.

![](/howitworks.png)

FEATURES:

1. Read reviews for on-chain addresses

2. Write reviews for on-chain addresses

3. Check addresses for maliciously flagged actors

4. Check projects for legitimacy

5. Find best projects through exploring highest rated addresses

6. Sybil resistance with minimum balance check (more to come)

7. EigenTrust re-computation cron job running every hour


### Simplified Architecture Diagram

![](/diagram.png)

### Tech Stack

- Optimism Goerli Testnet
- Web3Modal
- NextJS
- Express
- Firebase
- Ethers
- Hardhat
- wagmi hooks
- IPFS (web3.storage)

### Next Steps

- Add more interactive features such as Following other users and Customizable Profile pages
- Sybil resistance mechanisms such as RECAPTCHA or ID verification (last resort)
- Monetization strategy such as premium businesss or contributors who can filter for illegitimate/sybil reviews
- Add testing and monitoring for reliability
