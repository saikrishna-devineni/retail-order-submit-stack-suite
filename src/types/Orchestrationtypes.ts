export interface OrchestrationContext {
    // Base URLs
    baseUrl: string;
    paymentBaseUrl: string;

    // Trace and authentication
    'trace-id': string;

    // Location details
    address_lines: string;
    municipality: string;
    region: string;
    postal_code: string;
    country_code: string;
    latitude: number;
    longitude: number;

    // Business details
    partner_party_id: string;
    business_unit_party_id: string;
    from_date: string; // YYYY-MM-DD format
    to_date: string;   // YYYY-MM-DD format

    // FSI
    root_product_type_id: string;

    // Add-ons
    root_add_on_product_type_id: string;
    voice_add_on_product_type_id: string;

    // Additional dynamic fields (optional)
    [key: string]: any;
}