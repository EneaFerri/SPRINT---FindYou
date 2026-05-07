def calculate_score_preview() -> int:
    """Placeholder for future backend scoring with persisted weights and audit trail."""
    sector_risk = 80 * 0.35
    site_size = 70 * 0.20
    emissions = 75 * 0.20
    missing_abatement = 90 * 0.15
    strategic_density = 80 * 0.10
    return round(sector_risk + site_size + emissions + missing_abatement + strategic_density)
