---
layout: article
title: "The Faster a Closed-Source Leader Runs, the More Its Rivals Have to Cooperate"
subtitle: "A toy model of shared catch-up, parallel search, and why technological leadership can churn faster than market power."
description: "A model of how a fast closed-source leader can make shared catch-up attractive, and how an open technical commons changes the dynamics of innovation."
tags:
  - open-source
  - innovation
  - industrial-organization
  - game-theory
status: working draft
---

A closed-source technology leader can protect its position by moving faster than anyone else can copy it. By the time a follower reconstructs the current system, the leader has already released the next one.

This strategy works best when every rival runs the same race separately.

If the leader moves so quickly that no follower can reconstruct its progress alone, repeated private reconstruction stops being a sensible precaution. It becomes the reason everyone falls behind. Sharing the catch-up work may be the only way to remain in the race.

The strategy can therefore succeed against every follower individually while making cooperation between them more valuable.

<div class="model-note" markdown="1">
**What “open source” means here.** The model uses the term in a deliberately narrow way. Followers place lawfully reconstructed, reusable implementation work in a common codebase. One participant's catch-up work can then be used by the others. We assume that contribution and coordination function, and we do not model licensing or governance. The shared layer also need not contain every downstream product innovation: firms may still earn temporary returns through deployment, services, distribution, data, brand, or lead time. This is an abstraction of an open technical commons, not a complete theory of how open-source projects form.
</div>

The argument has three parts. First, moving quickly can make private following infeasible while leaving collective following feasible. Second, once catch-up is shared, the incumbent can no longer multiply the same defensive burden across every rival. Third, if market adoption is slow, technological leadership may churn without market power churning with it.

<a id="result-pooling"></a>

## Part I: One moving frontier, many repeated copies

Let the leader move the technological frontier at rate $x$. A follower has at most $E$ units of engineering capacity, and one unit of catch-up effort reconstructs existing progress at rate $\beta$.

A proprietary follower can remain current only if

$$
\beta E \geq x.
$$

If $x>\beta E$, the follower is not converging slowly. It is reproducing the leader's past while the distance to the frontier continues to grow.

Now suppose $N$ followers divide the reconstruction work. Their combined catch-up capacity is $N\beta E$, so the shared ecosystem can remain current whenever

$$
x<N\beta E.
$$

The interesting region is therefore

$$
\beta E<x<N\beta E.
$$

No follower can track the leader alone, but the followers can track it together. The leader has not removed competition. It has changed the organization required to compete.

<figure class="article-figure">
  <picture>
    <source media="(max-width: 600px)" srcset="{{ '/assets/img/posts/shared-catchup-mobile.svg' | relative_url }}">
    <img src="{{ '/assets/img/posts/shared-catchup.svg' | relative_url }}" alt="Four private followers repeat the same catch-up steps, while a shared commons performs the catch-up once and branches into four experiments.">
  </picture>
  <figcaption>Private followers spend capacity reconstructing the same steps. A shared layer pays that engineering burden once, then leaves the participants free to try different things. The figure is schematic; perfect division of work is an assumption.</figcaption>
</figure>

With equal sharing, each participant carries catch-up effort

$$
\frac{x}{\beta N}.
$$

The point is not that open-source engineers are intrinsically more productive. The point is that reconstructed knowledge is nonrival. Once a compatible component has been built, every participant can use it instead of building another copy.

That turns duplication into parallel search. Catch-up is shared; experiments can remain separate.

[The capacity conditions and their relationship to the dynamic model are collected in Appendix A.1.](#appendix-a1)

<a id="result-formation"></a>

## Part 1.5: An incentive to coordinate is not an ecosystem

The previous inequality says when pooling is useful. It does not show that a pool will form.

Suppose shared development creates per-participant coordination overhead $g(N)$, measured in the same engineering units as catch-up effort. A participant compares private maintenance effort $x/\beta$ with pooled maintenance effort

$$
\frac{x}{\beta N}+g(N).
$$

Pooling reduces its burden when

$$
g(N)<\frac{x}{\beta}\left(1-\frac{1}{N}\right).
$$

This makes the missing trade-off visible. It still does not solve free-riding. A real commons needs some combination of governance, reciprocity, modular architecture, reputational rewards, complementary private benefits, or funding that makes contribution sustainable.

The dynamic model below is therefore conditional: assume a shared technical layer has formed and that its maintenance work is divided symmetrically.

There is also a path-dependence issue. A fast leader may make collaboration necessary at the time the commons forms. Once sharing changes the competitive equilibrium, the leader may slow down enough that private following becomes feasible again. The common codebase can still persist, but that persistence is not derived here.

The narrower claim is enough:

> A fast closed leader can create a strong incentive to coordinate. It does not mechanically create a healthy open-source ecosystem.

[Appendix A.5 compares shared and proprietary following directly.](#appendix-a5)

<a id="result-race"></a>

## Part II: The race after the commons exists

Assume there is one technological leader and $N$ followers. The leader spends $x$ to move the frontier, at flow cost

$$
C_L(x)=\frac{\gamma}{2}x^2.
$$

Follower $i$ spends total engineering effort $e_i$, at flow cost

$$
C_F(e_i)=\frac{\kappa}{2}e_i^2.
$$

Under symmetric sharing, a follower first pays its catch-up share $x/(\beta N)$. Its remaining exploratory effort is

$$
z_i=e_i-\frac{x}{\beta N},
$$

which we require to be nonnegative. Exploration produces a breakthrough according to a Poisson process with intensity $\lambda z_i$. With symmetric effort $e$, the total rate at which some follower takes the technological lead is

$$
q=N\lambda z.
$$

Call $V_L$ the value of being the technological leader and $V_F$ the value of being a follower. Their difference

$$
\Delta=V_L-V_F
$$

is the leadership premium. This, rather than current revenue alone, is the prize firms spend money to gain or defend.

Let the leader receive profit flow $\pi_L$ and a follower receive $\pi_F$. Define their flow difference as

$$
P=\pi_L-\pi_F>0.
$$

The original winner-take-all market is the special case $\pi_L=M$ and $\pi_F=0$, so $P=M$. Keeping $P$ general will let us relax monopoly without rebuilding the model.

The equilibrium first-order conditions are simple:

$$
x^*=\frac{\lambda\Delta}{\gamma\beta},
\qquad
e^*=\frac{\lambda\Delta}{\kappa}.
$$

The incumbent spends more when the position is valuable to preserve. Each follower spends more when the same position is valuable to acquire.

After paying for catch-up, exploratory effort is

$$
z^*=\lambda\Delta\left(\frac{1}{\kappa}-\frac{1}{\gamma\beta^2N}\right).
$$

Define the critical ecosystem size

$$
N_c=\frac{\kappa}{\gamma\beta^2}.
$$

The interior solution has positive exploration when $N>N_c$. In that region, the displacement rate is

$$
q=\frac{\lambda^2\Delta}{\kappa}(N-N_c).
$$

The incumbent's frontier movement acts as if it removes a fixed number $N_c$ of challengers from the race. It does not neutralize a fixed fraction of a growing ecosystem.

[The Bellman equations, first-order conditions, and boundary assumptions are in Appendix A.2.](#appendix-a2)

### What sharing changes

The shared and proprietary hazards expose the mechanism directly. If every follower reconstructs the frontier independently,

$$
\begin{aligned}
q_{\mathrm{private}}
&=N\lambda\left(e-\frac{x}{\beta}\right),\\
&=N\lambda e-\frac{N\lambda}{\beta}x.
\end{aligned}
$$

If catch-up is shared,

$$
\begin{aligned}
q_{\mathrm{shared}}
&=N\lambda\left(e-\frac{x}{\beta N}\right),\\
&=N\lambda e-\frac{\lambda}{\beta}x.
\end{aligned}
$$

Therefore

$$
\begin{aligned}
\frac{\partial q_{\mathrm{private}}}{\partial x}
&=-\frac{N\lambda}{\beta},\\
\frac{\partial q_{\mathrm{shared}}}{\partial x}
&=-\frac{\lambda}{\beta}.
\end{aligned}
$$

Without sharing, one unit of incumbent progress imposes one unit of reconstruction on every follower. With sharing, it creates one common reconstruction problem. This is the dynamic role of the commons.

<a id="result-large-n"></a>

### A large ecosystem makes leadership less durable

Solving the two value equations gives

$$
r\Delta+A_N\Delta^2=P,
$$

where $A_N$ collects the effects of research costs, catch-up productivity, and ecosystem size. Its full expression is not illuminating in the middle of the argument, so it is left in [Appendix A.3](#appendix-a3).

For large $N$,

$$
A_N\approx\frac{\lambda^2N}{\kappa}.
$$

The leadership premium is therefore approximately

$$
\Delta\approx\frac{\sqrt{P\kappa}}{\lambda\sqrt{N}}.
$$

As the ecosystem grows, leadership becomes less valuable because it is expected to last for less time. The current leader can still earn a large flow profit. It just cannot expect to keep the position for long.

The individual effort choices inherit the same scaling:

$$
x^*\propto N^{-1/2},
\qquad
e^*\propto N^{-1/2}.
$$

Both the leader and each follower spend less. Yet aggregate turnover rises:

$$
q\approx\lambda\sqrt{\frac{P}{\kappa}}\sqrt{N}.
$$

The expected duration of a technological leadership spell is $1/q$, so it falls like $N^{-1/2}$.

This is a discouragement effect. Defensive innovation is valuable in proportion to the asset being defended. When leadership is already fragile, preserving it for a little longer is worth less. Each challenger reaches the same conclusion about acquiring it. The ecosystem still produces more turnover because it contains many parallel attempts.

[The large-$N$ approximation is derived in Appendix A.4.](#appendix-a4)

<a id="result-partial-market"></a>

## Monopoly is a special case, not the mechanism

Suppose total industry profit is $M$. Let the technological leader receive share $\mu$ of it, while the $N$ followers divide the rest equally:

$$
\pi_L=\mu M,
\qquad
\pi_F=\frac{1-\mu}{N}M.
$$

The prize becomes

$$
P=M\left(\mu-\frac{1-\mu}{N}\right).
$$

Setting $\mu=1$ recovers monopoly. Setting $\mu=1/(N+1)$ gives equal shares and $P=0$. Between those cases, the earlier equations continue to hold after replacing $M$ with $P$.

The square-root result therefore does not require the leader to own the entire market. It requires a positive profit advantage from being ahead.

This relaxation is deliberately cheap. Market shares still jump immediately when the technological leader changes. That is the next assumption worth relaxing.

[Appendix A.7 records the substitution and its asymptotic implication.](#appendix-a7)

<a id="result-adoption"></a>

## When the frontier moves faster than the market

Let $m_i(t)$ be firm $i$'s actual market share. When firm $\ell$ holds the technological lead, give the market a target allocation

$$
\bar m_\ell=\mu,
\qquad
\bar m_i=\frac{1-\mu}{N}\quad(i\neq\ell).
$$

Instead of jumping to that allocation, actual shares move toward it at adoption rate $\delta$:

$$
\dot m_i=\delta(\bar m_i-m_i).
$$

We can initialize the system with a monopoly, $m_0(0)=1$ and $m_i(0)=0$ for every other firm, then let technological leadership change through the innovation race.

The ratio $q/\delta$ separates two regimes.

When $q\ll\delta$, customers adopt the new leader's technology before another breakthrough arrives. Immediate market reallocation is a reasonable approximation.

When $q\gg\delta$, the frontier changes faster than the market can absorb it. A firm can lose the technological lead before acquiring much market share. Technical leadership churns while installed customers, integrations, habits, and complements move slowly.

<figure class="article-figure">
  <picture>
    <source media="(max-width: 600px)" srcset="{{ '/assets/img/posts/adoption-lag-mobile.svg' | relative_url }}">
    <img src="{{ '/assets/img/posts/adoption-lag.svg' | relative_url }}" alt="Technological leadership moves from firm A to B to C to D while market shares adjust slowly and remain distributed across earlier leaders.">
  </picture>
  <figcaption>A schematic adoption path, not a simulation. The frontier changes four times, but the initial incumbent still has the largest installed share at the end. The percentages are illustrative.</figcaption>
</figure>

In the stripped-down case where a new leader starts with zero adoption, moves toward full adoption at rate $\delta$, and is displaced at rate $q$, the expected fraction of the market it reaches before displacement is

$$
\frac{\delta}{\delta+q}.
$$

This friction changes more than a constant delay would. A fixed delay mainly discounts the prize. Gradual adoption makes the prize itself depend on how quickly the frontier turns over.

It also opens a different regime:

> Technological monopoly can disappear quickly while commercial concentration remains stubbornly persistent.

This extension is not yet a closed strategic equilibrium. Once profits depend on the full market-share vector, firm values are no longer summarized by two numbers $V_L$ and $V_F$. A complete solution would let effort respond to installed shares. That extra state is justified only if it produces something beyond the analytical observation above.

This is also where simulation could earn its place. The useful outputs would be the frequency with which the technical and commercial leaders differ, the resulting market concentration, and whether adoption feedback caps effective turnover. Simulating the baseline square-root formulas would add decoration rather than information.

[The adoption calculation and its limits are in Appendix A.8.](#appendix-a8)

## What the model does not establish

The model isolates one mechanism. Several things remain outside it:

- The ecosystem size $N$ is exogenous. The leader creates an incentive to coordinate, not a literal population of contributors.
- Equal contribution is assumed. Free-riding, governance, and project architecture can decide whether the commons exists at all.
- Breakthroughs are independent and arrive with linear Poisson intensity. Correlated experiments or duplicated research would weaken the benefit of adding participants.
- The model tracks a frontier rate, not an accumulated technology gap. A discrete leap does not impose a new one-time catch-up cost on everyone else.
- The market prize measures private profit. Consumer welfare, prices, innovation quality, and the cost of rapid obsolescence are not evaluated.
- In the adoption extension, technological effort does not yet respond endogenously to each firm's installed market share.

These are not small details in every application. They mark the boundary of the claim.

## Intellectual ancestors

The innovation race sits near an old industrial-organization literature. [Glenn Loury's model of market structure and innovation](https://academic.oup.com/qje/article-abstract/93/3/395/1890051) studies stochastic R&D effort and entry. [Jennifer Reinganum](https://www.hss.caltech.edu/research/social-sciences-research/working-papers/uncertain-innovation-and-the-persistence-of-monopoly) and [Richard Gilbert with David Newbery](https://ideas.repec.org/a/aea/aecrev/v72y1982i3p514-26.html) reached different conclusions about uncertain innovation and the persistence of monopoly, depending on how incumbent and entrant incentives are modeled. [Philippe Aghion and Peter Howitt](https://www.nber.org/system/files/working_papers/w3223/w3223.pdf) made creative destruction and the threat of future obsolescence central to a dynamic growth model.

The shared catch-up mechanism is closer to [Robert Allen's “collective invention”](https://ora.ox.ac.uk/objects/uuid%3A9a4826eb-2da0-4876-8ff8-42044b544f0a) than to a generic claim about openness. The open-source incentive problem appears directly in [Josh Lerner and Jean Tirole](https://www.nber.org/papers/w7600), while [Eric von Hippel and Georg von Krogh](https://pubsonline.informs.org/doi/pdf/10.1287/orsc.14.2.209.14992) describe open source as a private-collective innovation model. [Carliss Baldwin and Kim Clark](https://www.hbs.edu/faculty/Pages/item.aspx?num=20823) ask when modular architecture mitigates free-riding. [James Bessen and Eric Maskin](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1756-2171.2009.00081.x) are especially relevant to sequential and complementary innovation under imitation.

For the adoption extension, [Frank Bass's diffusion model](https://pubsonline.informs.org/doi/pdf/10.1287/mnsc.15.5.215) is the obvious historical starting point. [Joseph Farrell and Paul Klemperer](https://papers.ssrn.com/sol3/Delivery.cfm/SSRN_ID917785_code1447.pdf?abstractid=917785&mirid=1) explain why switching costs and network effects can bind customers to an installed supplier even when a better alternative exists.

## The narrower conclusion

A fast closed-source leader does not automatically create an open-source rival. It can make repeated private reconstruction so wasteful that a common technical layer becomes the only plausible way to keep up.

If that layer forms, the leader creates one moving frontier while the ecosystem conducts many experiments around it. Defensive progress no longer scales with the number of rivals in the way it did when each rival had to reconstruct everything alone. Technological leadership becomes less durable.

Market power may still persist. When adoption is slow, the firm at the frontier and the firm with the installed base need not be the same firm. The technology can churn long before the market does.

---

<a id="appendix"></a>

## Appendix: derivations and boundary conditions

<p class="appendix-intro">The main text links directly to the relevant calculation. Each section links back to the result it supports.</p>

<a id="appendix-a1"></a>

### A.1 Capacity and the static pooling region

An independent follower reconstructs frontier movement at rate $\beta E$. Its technology gap grows when $x>\beta E$.

If $N$ followers can divide work without loss, their aggregate reconstruction rate is $N\beta E$. They can track the leader when $x\leq N\beta E$. The strict region

$$
\beta E<x<N\beta E
$$

makes individual tracking infeasible and collective tracking feasible.

The later dynamic model uses quadratic effort costs and assumes the capacity bound does not bind, so it additionally requires $e^*\leq E$. Connecting the two parts at the same parameter values would require checking

$$
e^*\leq E,
\qquad
\beta E<x^*<N\beta E.
$$

Those inequalities are not guaranteed. In fact, $x^*$ falls with $N$ in the large-ecosystem equilibrium, so the first static inequality eventually fails for fixed $E$. Part I is best read as a formation pressure, not a condition that necessarily remains binding forever.

<p class="back-link"><a href="#result-pooling">↩ Back to Part I</a></p>

<a id="appendix-a2"></a>

### A.2 Bellman equations and equilibrium effort

Let $z=e-x/(\beta N)$ and $q=N\lambda z$. The leader receives profit flow $\pi_L$, pays innovation cost, and falls to the follower state at rate $q$:

$$
rV_L=\pi_L-\frac{\gamma}{2}x^2-q\Delta.
$$

A follower receives $\pi_F$, pays engineering cost, and reaches the leader state through its own breakthrough at rate $\lambda z$:

$$
rV_F=\pi_F-\frac{\kappa}{2}e^2+\lambda z\Delta.
$$

Breakthroughs by other followers do not appear as a value jump because the focal firm remains a follower.

Holding continuation values and the other firms' controls fixed, the leader's first-order condition is

$$
\gamma x=\frac{\lambda}{\beta}\Delta,
$$

so

$$
x^*=\frac{\lambda\Delta}{\gamma\beta}.
$$

The follower's first-order condition is

$$
\kappa e=\lambda\Delta,
$$

so

$$
e^*=\frac{\lambda\Delta}{\kappa}.
$$

Substitution gives

$$
z^*=\lambda\Delta\left(\frac{1}{\kappa}-\frac{1}{\gamma\beta^2N}\right).
$$

Positive exploration requires

$$
N>N_c,
\qquad
N_c=\frac{\kappa}{\gamma\beta^2}.
$$

Within that region, the objective is concave in each firm's own control, and the candidate lies below the leader's full-blocking boundary $x=\beta Ne$. The displacement hazard is

$$
q=N\lambda z^*
=\frac{\lambda^2\Delta}{\kappa}(N-N_c).
$$

<p class="back-link"><a href="#result-race">↩ Back to the dynamic race</a></p>

<a id="appendix-a3"></a>

### A.3 Solving for the leadership premium

Subtract the follower Bellman equation from the leader equation. With $P=\pi_L-\pi_F$,

$$
r\Delta
=P-\frac{\gamma}{2}x^2+\frac{\kappa}{2}e^2-(q+\lambda z)\Delta.
$$

Substitute $x^*$, $e^*$, and $z^*$. After collecting terms,

$$
r\Delta+A_N\Delta^2=P,
$$

where

$$
A_N
=\lambda^2\left(
\frac{N+\frac12}{\kappa}
-\frac{\frac12+\frac1N}{\gamma\beta^2}
\right).
$$

Under the interior condition $N>N_c$, $A_N$ is positive. The economically relevant root is

$$
\Delta
=\frac{-r+\sqrt{r^2+4A_NP}}{2A_N}.
$$

<p class="back-link"><a href="#result-large-n">↩ Back to the leadership-premium result</a></p>

<a id="appendix-a4"></a>

### A.4 Large-ecosystem asymptotics

For large $N$,

$$
A_N\sim\frac{\lambda^2N}{\kappa}.
$$

The quadratic term in

$$
r\Delta+A_N\Delta^2=P
$$

dominates the linear term, giving

$$
\Delta
\sim\sqrt{\frac{P}{A_N}}
=\frac{\sqrt{P\kappa}}{\lambda\sqrt N}.
$$

Therefore

$$
x^*\sim\frac{1}{\gamma\beta}\sqrt{\frac{P\kappa}{N}},
\qquad
e^*\sim\sqrt{\frac{P}{\kappa N}}.
$$

Finally,

$$
q
=\frac{\lambda^2\Delta}{\kappa}(N-N_c)
\sim\lambda\sqrt{\frac{P}{\kappa}}\sqrt N.
$$

<p class="back-link"><a href="#result-large-n">↩ Back to the large-ecosystem result</a></p>

<a id="appendix-a5"></a>

### A.5 Shared versus proprietary following

With proprietary catch-up, follower exploration is $z_p=e-x/\beta$, so

$$
q_p=N\lambda e-\frac{N\lambda}{\beta}x.
$$

The local marginal effect of incumbent innovation is

$$
\frac{\partial q_p}{\partial x}=-\frac{N\lambda}{\beta}.
$$

The leader's interior first-order condition would therefore be

$$
x_p^*=\frac{N\lambda\Delta}{\gamma\beta}.
$$

With shared catch-up, $z_s=e-x/(\beta N)$ and

$$
q_s=N\lambda e-\frac{\lambda}{\beta}x,
\qquad
x_s^*=\frac{\lambda\Delta}{\gamma\beta}.
$$

This comparison is local and interior. In the proprietary case, the leader may instead push followers to the zero-exploration boundary. The point needed in the main argument is mechanical: sharing removes the factor $N$ from the incumbent's marginal effect on aggregate breakthrough pressure.

<p class="back-link"><a href="#result-formation">↩ Back to Part 1.5</a></p>

<a id="appendix-a6"></a>

### A.6 Participation and the outside option

At the interior controls,

$$
rV_F
=\pi_F
+\frac{\lambda^2\Delta^2}{\kappa}
\left(\frac12-\frac{N_c}{N}\right).
$$

In the winner-take-all case, $\pi_F=0$. If nonparticipation has value zero, positive exploration at $N>N_c$ is not by itself enough to guarantee voluntary participation. The follower value is nonnegative only when

$$
N\geq2N_c.
$$

A positive follower profit flow, complementary benefit, subsidy, or contribution reward can relax this condition. The article treats $N$ as exogenous and does not impose free entry.

<p class="back-link"><a href="#result-race">↩ Back to the dynamic race</a></p>

<a id="appendix-a7"></a>

### A.7 Partial market shares

If the leader receives fraction $\mu$ of industry profit and followers split the residual,

$$
P
=\pi_L-\pi_F
=M\left(\mu-\frac{1-\mu}{N}\right).
$$

Only this flow difference enters the equation for $\Delta$. For fixed $\mu>0$ and large $N$, $P\to\mu M$, so

$$
\Delta
\sim\frac{\sqrt{\mu M\kappa}}{\lambda\sqrt N},
\qquad
q\sim\lambda\sqrt{\frac{\mu M}{\kappa}}\sqrt N.
$$

The scaling survives. Monopoly changes the level of the prize, not the source of the result.

<p class="back-link"><a href="#result-partial-market">↩ Back to the partial-market result</a></p>

<a id="appendix-a8"></a>

### A.8 Gradual adoption

Between changes in technological leadership, target shares $\bar m_i$ are fixed and

$$
\dot m_i=\delta(\bar m_i-m_i).
$$

The solution is

$$
m_i(t)=\bar m_i+\left(m_i(0)-\bar m_i\right)e^{-\delta t}.
$$

For the simplest illustration, let a new leader begin with market share zero and target share one. Then

$$
m(t)=1-e^{-\delta t}.
$$

If its technological leadership spell has length $T\sim\mathrm{Exp}(q)$,

$$
\mathbb E[e^{-\delta T}]=\frac{q}{q+\delta},
$$

and therefore

$$
\mathbb E[m(T)]
=1-\frac{q}{q+\delta}
=\frac{\delta}{q+\delta}.
$$

If the leader earns flow $Mm(t)$ until displacement, define its expected discounted revenue in this stripped-down case as

$$
R_A=\mathbb E\left[
\int_0^T e^{-rt}Mm(t)\,dt
\right].
$$

Then

$$
R_A=M\left(
\frac{1}{r+q}-\frac{1}{r+q+\delta}
\right).
$$

As $\delta\to\infty$, this approaches the immediate-adoption value $M/(r+q)$. When adoption is slow relative to turnover, the leader captures much less of the nominal prize.

This is an accounting extension, not yet the solution of the strategic game with market shares as state variables.

<p class="back-link"><a href="#result-adoption">↩ Back to the adoption extension</a></p>
