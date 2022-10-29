delete colors FROM SolarPanelColors as colors
LEFT JOIN SolarPanel as panel on colors.id=panel.solarPanelColorsId
where panel.solarPanelColorsId is null