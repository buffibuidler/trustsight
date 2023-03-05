# EigenTrust Computation

Here's a quick primer: let’s think about how we establish trust in real life. I trust my friend Alice because the history of interactions we’ve had has been a net positive for me. But how do I trust Bob, who I’ve never met before? Well if my friend Alice says Bob is her trusted friend, then I’m inclined to trust Bob. And the more I trust Alice, my trust towards Bob will amplify.

So once you have a trust score for the peers in your direct network, you’ll be able to infer the trust score of peers of those peers, and the peers of those peers and so on, until you eventually cover the entire network. And if you aggregate the “trust scores” from every peer in the network and constantly iterate that computation for each individual, those values stabilize into unique global trust scores for every individual in the network. This is the underlying principle of the EigenTrust algorithm, just like how Google’s PageRank system works.

![](/server/eigen.png)

`eigentrust.js` has a simple, non-distributed version of this algorithm where we create pools of users (think of groups of directly connected nodes) and iterate over the network until the values converge and stabilize. We constantly update the global trust graph every hour based on the newly computed results.

