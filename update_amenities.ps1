# Script to update getAmenities function in PropertyDetail.tsx

$filePath = "regiamare-web\src\routes\PropertyDetail\PropertyDetail.tsx"

$newFunction = @"
  // Get amenities - checking for boolean values or SI/NO text
  const getAmenities = () => {
    if (!property) return [];
    
    const amenities: Array<{ key: string; label: string; icon: string }> = [];
    const attrs = property.attributes as any;

    if (attrs.air_conditioning === true || attrs.air_conditioning?.toString().toUpperCase() === 'SI') {
      amenities.push({ key: 'air_conditioning', label: 'Aire Acondicionado', icon: '❄️' });
    }
    if (attrs.built_in_wardrobes === true || attrs.built_in_wardrobes?.toString().toUpperCase() === 'SI') {
      amenities.push({ key: 'built_in_wardrobes', label: 'Armarios Empotrados', icon: '🚪' });
    }
    if (attrs.furnished === true || attrs.furnished?.toString().toUpperCase() === 'SI') {
      amenities.push({ key: 'furnished', label: 'Amueblado', icon: '🛋️' });
    }
    if (attrs.has_balcony === true) {
      amenities.push({ key: 'has_balcony', label: 'Balcón', icon: '🏠' });
    }
    if (attrs.has_communal_gardens === true) {
      amenities.push({ key: 'has_communal_gardens', label: 'Jardines Comunitarios', icon: '🌳' });
    }
    if (attrs.has_elevator === true || attrs.elevator === true) {
      amenities.push({ key: 'has_elevator', label: 'Ascensor', icon: '🛗' });
    }
    if (attrs.has_fireplace === true) {
      amenities.push({ key: 'has_fireplace', label: 'Chimenea', icon: '🔥' });
    }
    if (attrs.has_garden === true || attrs.has_patio === true || attrs.garden === true) {
      amenities.push({ key: 'has_garden', label: 'Jardín/Patio', icon: '🏡' });
    }
    if (attrs.has_gym === true) {
      amenities.push({ key: 'has_gym', label: 'Gimnasio', icon: '💪' });
    }
    if (attrs.has_home_automation === true || attrs.has_home_automation?.toString().toUpperCase() === 'SI') {
      amenities.push({ key: 'has_home_automation', label: 'Domótica', icon: '🤖' });
    }
    if (attrs.has_paddle_tennis === true) {
      amenities.push({ key: 'has_paddle_tennis', label: 'Pádel', icon: '🎾' });
    }
    if (attrs.has_terrace === true || attrs.terrace === true) {
      amenities.push({ key: 'has_terrace', label: 'Terraza', icon: '☀️' });
    }
    if (attrs.has_storage_room === true || attrs.storage_room === true) {
      amenities.push({ key: 'has_storage_room', label: 'Trastero', icon: '📦' });
    }
    if (attrs.has_tourist_license === true) {
      amenities.push({ key: 'has_tourist_license', label: 'Licencia Turística', icon: '📋' });
    }
    if (attrs.pets_allowed === true || attrs.pets_allowed?.toString().toUpperCase() === 'SI') {
      amenities.push({ key: 'pets_allowed', label: 'Mascotas Permitidas', icon: '🐕' });
    }
    if (attrs.pool_type && attrs.pool_type !== '' && attrs.pool_type !== 'Sin Piscina') {
      amenities.push({ key: 'pool_type', label: 'Piscina', icon: '🏊' });
    } else if (attrs.pool === true) {
      amenities.push({ key: 'pool', label: 'Piscina', icon: '🏊' });
    }
    if (attrs.security_system === true) {
      amenities.push({ key: 'security_system', label: 'Seguridad', icon: '🔒' });
    }
    if (attrs.accessibility === true) {
      amenities.push({ key: 'accessibility', label: 'Accesibilidad', icon: '♿' });
    }
    if (attrs.parking === true) {
      amenities.push({ key: 'parking', label: 'Parking', icon: '🚗' });
    }

    return amenities;
  };
"@

# Read the file
$content = Get-Content $filePath -Raw -Encoding UTF8

# Find and replace the function (from "// Get amenities" to the closing brace before "if (loading)")
$pattern = '(?s)  // Get amenities.*?return amenities;\s*};'
$updatedContent = $content -replace $pattern, $newFunction

# Write back
$updatedContent | Out-File $filePath -Encoding UTF8 -NoNewline

Write-Host "✓ Successfully updated getAmenities function" -ForegroundColor Green
