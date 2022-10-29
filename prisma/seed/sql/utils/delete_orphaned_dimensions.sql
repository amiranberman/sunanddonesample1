delete dim FROM Dimensions as dim
LEFT JOIN SolarPanel as panel on dim.id=panel.dimensionsId
where panel.dimensionsId is null