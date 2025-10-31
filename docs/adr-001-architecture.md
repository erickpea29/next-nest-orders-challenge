# ADR-001: Layered vs Hexagonal-lite

We chose a **layered approach** (Controller → Service → Repository) with small hexagonal hints (DTOs, repository as a port). It balances clarity for candidates with room to propose improvements (CQRS, domain events, outbox, etc.).
