import { authJwt } from './services/auth/auth_jwt';
import { scrubLocation } from './services/geo/scrub_location';
import { verifyLocationByCoordinates } from './services/geo/verify_location_by_coordinates';
import { getAvailableAppointments } from './services/fulfillment/get_available_appointments';
import { agreements } from './services/agreements/agreements';
import { previewProducts } from './services/offers/preview_products';
import { addCustomer } from './services/customers/add_customer';
import { showCustomer } from './services/customers/show_customer';
import { changeCustomer } from './services/customers/change_customer';
import { getAvailableProducts } from './services/offers/get_available_products';
import { addFsiToCart } from './services/offers/add_fsi_to_cart';
import { getShoppingCart } from './services/offers/get_shopping_cart';
import { getAddons } from './services/offers/get_addons';
import { extendVoiceAddons } from './services/offers/extend_voice_addons';
import { finalizeShoppingCart } from './services/offers/finalize_shopping_cart';
import { submitOrder } from './services/orders/submit_order';
import { getTaxCodes } from './services/billing/get_tax_codes';
import { addBillingAccount } from './services/billing/add_billing_account';
import { getOrder } from './services/orders/get_order';
import { createPaymentTransaction } from './services/payment/create_payment_transaction';
import { completePaymentTransaction } from './services/payment/complete_payment_transaction';
import { extendRootAddons } from './services/offers/extend_root_addons';
import { getEICMessages } from './services/offers/get_eic_messages';
import { updateEIC } from './services/offers/update_eic';


export enum OrchestrationSteps {
    AUTH_JWT = 'auth_jwt',
    SCRUB_LOCATION = 'scrub_location',
    VERIFY_LOCATION = 'verify_location_by_coordinates',
    AGREEMENTS = 'agreements',
    PREVIEW_PRODUCTS = 'preview_products',
    ADD_CUSTOMER = 'add_customer',
    SHOW_CUSTOMER = 'show_customer',
    CHANGE_CUSTOMER = 'change_customer',
    GET_AVAILABLE_PRODUCTS = 'get_available_products',
    ADD_FSI_TO_CART = 'add_fsi_to_cart',
    GET_SHOPPING_CART = 'get_shopping_cart',
    GET_ADDONS = 'get_addons',
    EXTEND_VOICE_ADDONS = 'extend_voice_addons',
    EXTEND_ROOT_ADDONS = 'extend_root_addons',
    GET_EIC_MESSAGES = 'get_eic_messages',
    UPDATE_EIC = 'update_eic',
    FINALIZE_CART = 'finalize_shopping_cart',
    GET_TAX_CODES = 'get_tax_codes',
    ADD_BILLING_ACCOUNT = 'add_billing_account',
    GET_APPOINTMENTS = 'get_available_appointments',
    CREATE_PAYMENT = 'create_payment_transaction',
    COMPLETE_PAYMENT = 'complete_payment_transaction',
    SUBMIT_ORDER = 'submit_order',
    GET_ORDER = 'get_order',
}

export const requestMapper: Record<OrchestrationSteps, any> = {
    [OrchestrationSteps.AUTH_JWT]: authJwt,
    [OrchestrationSteps.SCRUB_LOCATION]: scrubLocation,
    [OrchestrationSteps.VERIFY_LOCATION]: verifyLocationByCoordinates,
    [OrchestrationSteps.GET_APPOINTMENTS]: getAvailableAppointments,
    [OrchestrationSteps.AGREEMENTS]: agreements,
    [OrchestrationSteps.PREVIEW_PRODUCTS]: previewProducts,
    [OrchestrationSteps.ADD_CUSTOMER]: addCustomer,
    [OrchestrationSteps.SHOW_CUSTOMER]: showCustomer,
    [OrchestrationSteps.CHANGE_CUSTOMER]: changeCustomer,
    [OrchestrationSteps.GET_AVAILABLE_PRODUCTS]: getAvailableProducts,
    [OrchestrationSteps.ADD_FSI_TO_CART]: addFsiToCart,
    [OrchestrationSteps.GET_SHOPPING_CART]: getShoppingCart,
    [OrchestrationSteps.GET_ADDONS]: getAddons,
    [OrchestrationSteps.EXTEND_VOICE_ADDONS]: extendVoiceAddons,
    [OrchestrationSteps.GET_EIC_MESSAGES]: getEICMessages,
    [OrchestrationSteps.UPDATE_EIC]: updateEIC,
    [OrchestrationSteps.FINALIZE_CART]: finalizeShoppingCart,
    [OrchestrationSteps.SUBMIT_ORDER]: submitOrder,
    [OrchestrationSteps.GET_TAX_CODES]: getTaxCodes,
    [OrchestrationSteps.ADD_BILLING_ACCOUNT]: addBillingAccount,
    [OrchestrationSteps.GET_ORDER]: getOrder,
    [OrchestrationSteps.CREATE_PAYMENT]: createPaymentTransaction,
    [OrchestrationSteps.COMPLETE_PAYMENT]: completePaymentTransaction,
    [OrchestrationSteps.EXTEND_ROOT_ADDONS]: extendRootAddons,
};

export const errorMapper: Record<OrchestrationSteps, string> = {
    [OrchestrationSteps.AUTH_JWT]: 'Authentication Error',
    [OrchestrationSteps.SCRUB_LOCATION]: 'Location Scrubbing Error',
    [OrchestrationSteps.VERIFY_LOCATION]: 'Location Verification Error',
    [OrchestrationSteps.GET_APPOINTMENTS]: 'Appointment Retrieval Error',
    [OrchestrationSteps.AGREEMENTS]: 'Agreements Retrieval Error',
    [OrchestrationSteps.PREVIEW_PRODUCTS]: 'Product Preview Error',
    [OrchestrationSteps.ADD_CUSTOMER]: 'Add Customer Error',
    [OrchestrationSteps.SHOW_CUSTOMER]: 'Show Customer Error',
    [OrchestrationSteps.CHANGE_CUSTOMER]: 'Change Customer Error',
    [OrchestrationSteps.GET_AVAILABLE_PRODUCTS]: 'Available Products Retrieval Error',
    [OrchestrationSteps.ADD_FSI_TO_CART]: 'Add FSI to Cart Error',
    [OrchestrationSteps.GET_SHOPPING_CART]: 'Get Shopping Cart Error',
    [OrchestrationSteps.GET_ADDONS]: 'Get Addons Error',
    [OrchestrationSteps.EXTEND_VOICE_ADDONS]: 'Extend Voice Addons Error',
    [OrchestrationSteps.GET_EIC_MESSAGES]: 'Get EIC Messages Error',
    [OrchestrationSteps.UPDATE_EIC]: 'Update EIC Error',
    [OrchestrationSteps.FINALIZE_CART]: 'Finalize Shopping Cart Error',
    [OrchestrationSteps.SUBMIT_ORDER]: 'Submit Order Error',
    [OrchestrationSteps.GET_TAX_CODES]: '  Get Tax Codes Error',
    [OrchestrationSteps.ADD_BILLING_ACCOUNT]: 'Add Billing Account Error',
    [OrchestrationSteps.GET_ORDER]: 'Get Order Error',
    [OrchestrationSteps.CREATE_PAYMENT]: 'Create Payment Transaction Error',
    [OrchestrationSteps.COMPLETE_PAYMENT]: 'Complete Payment Transaction Error',
    [OrchestrationSteps.EXTEND_ROOT_ADDONS]: 'Extend Root Addons Error',
};