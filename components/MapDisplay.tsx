interface MapDisplayProps {
    latitude: number
    longitude: number
}

const MapDisplay = ({ latitude, longitude }: MapDisplayProps) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    const zoomLevel = 0.002
    const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - zoomLevel},${latitude - zoomLevel},${longitude + zoomLevel},${latitude + zoomLevel}&layer=mapnik&marker=${latitude},${longitude}`

    return (
        <div className="w-full space-y-3">
            {/* Map Container */}
            <div className="w-full aspect-video relative rounded-lg overflow-hidden border-2 border-gray-200">
                <iframe
                    src={osmEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    className="absolute inset-0"
                />

                {/* "Open in Google Maps" Button Overlay */}
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors font-medium text-sm"
                >
                    Open in Google Maps
                </a>
            </div>
        </div >
    )
}

export default MapDisplay