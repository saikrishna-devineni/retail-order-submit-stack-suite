import { randomUUID } from 'crypto';
import { requestMapper, OrchestrationSteps, errorMapper } from './requestMapper';
import { OrchestrationContext } from './types/Orchestrationtypes';
import { API_BASE_URL, ADDON_PRODUCT_IDS, INTERNET_PLAN, PAYMENT_BASE_URL, VOICE_PRODUCT_ID } from './constants';
import { Logger } from './utils/logger';

const dayInMilliSec = 86400000;

const context: OrchestrationContext = {
    baseUrl: API_BASE_URL,
    paymentBaseUrl: PAYMENT_BASE_URL,
    'trace-id': randomUUID(),
    
    address_lines: 'XXX PRAIRIE XXXX LN',
    municipality: 'FAIRVIEW',
    region: 'MT',
    postal_code: '59221',
    country_code: 'US',
    latitude: 0,
    longitude: 0,
    
    partner_party_id: 'partner-9450-4834-a5b2-12bc827e8948',
    business_unit_party_id: 'business-34845973-67b9-50a6-8835-6a5b3469ba66',
    
    given_name: 'John',
    middle_name: 'Michael',
    surname: 'Doe',
    dob: '1990-01-01',
    email: 'john.doe@example.com',
    phone_number: '+15555555555',
    external_id: '999999999',
    taxpayer_id: '5678',
    
    from_date: new Date(Date.now()).toISOString().split('T')[0], 
    to_date: new Date(Date.now() + (dayInMilliSec * 14)).toISOString().split('T')[0],
    
    root_product_type_id: INTERNET_PLAN.base_plan_basic,
    voice_add_on_product_type_id: VOICE_PRODUCT_ID,
    root_add_on_product_type_id: ADDON_PRODUCT_IDS.addon_basic,
};

const orchestrateSequence: OrchestrationSteps[] = [
    OrchestrationSteps.AUTH_JWT,
    OrchestrationSteps.SCRUB_LOCATION,
    OrchestrationSteps.VERIFY_LOCATION,
    OrchestrationSteps.AGREEMENTS,
    OrchestrationSteps.PREVIEW_PRODUCTS,
    OrchestrationSteps.ADD_CUSTOMER,
    OrchestrationSteps.SHOW_CUSTOMER,
    OrchestrationSteps.CHANGE_CUSTOMER,
    OrchestrationSteps.GET_AVAILABLE_PRODUCTS,
    OrchestrationSteps.ADD_FSI_TO_CART,
    OrchestrationSteps.GET_SHOPPING_CART,
    OrchestrationSteps.GET_ADDONS,
    OrchestrationSteps.EXTEND_VOICE_ADDONS,
    OrchestrationSteps.EXTEND_ROOT_ADDONS,
    OrchestrationSteps.GET_EIC_MESSAGES,
    OrchestrationSteps.UPDATE_EIC,
    OrchestrationSteps.FINALIZE_CART,
    OrchestrationSteps.GET_TAX_CODES,
    OrchestrationSteps.ADD_BILLING_ACCOUNT,
    OrchestrationSteps.GET_APPOINTMENTS,
    OrchestrationSteps.CREATE_PAYMENT,
    OrchestrationSteps.COMPLETE_PAYMENT,
    OrchestrationSteps.SUBMIT_ORDER,
    OrchestrationSteps.GET_ORDER
];

async function orchestrate(orchestrationSequence: OrchestrationSteps[], orchestrationContext: OrchestrationContext): Promise<void> {
    const startTime = Date.now();
    let completedSteps = 0;
    const isCI = process.env.CI === 'true';
    
    // Clear previous log file
    Logger.clearOldLogs();
    
    try {
        Logger.log('Starting order orchestration', {
            environment: process.env.NODE_ENV || 'development',
            isCI,
            totalSteps: orchestrationSequence.length,
            traceId: orchestrationContext['trace-id']
        });
        
        for (const step of orchestrationSequence) {
            try {
                if (orchestrationContext.stop_orchestration) {
                    Logger.log('Orchestration stopped by previous step');
                    break;
                }

                if (requestMapper[step]) {
                    Logger.step(step, completedSteps + 1, orchestrationSequence.length);
                    orchestrationContext['trace-id'] = randomUUID();
                    
                    const result = await requestMapper[step](orchestrationContext);
                    Object.assign(orchestrationContext, result);
                    completedSteps++;
                    
                    Logger.success(`Step completed: ${step}`);
                } else {
                    Logger.error(`Function ${step} not found in requestMapper`);
                }
            } catch (stepError: any) {
                Logger.error(`Error occurred during step: ${step}`, stepError);
                throw new Error(`Error Code: ${errorMapper[step]}, Message: ${stepError?.message || 'An error occurred'}`);
            }
        }
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        Logger.success('Orchestration completed successfully!', {
            duration: `${duration}s`,
            stepsCompleted: `${completedSteps}/${orchestrationSequence.length}`,
            orderId: orchestrationContext.order_id,
            customerId: orchestrationContext.customer_party_id,
            billingAccountId: orchestrationContext.billing_account_id
        });
        
        if (isCI) {
            process.exit(0);
        }
        
    } catch (error) {
        Logger.error('Orchestration failed', error);
        
        if (isCI) {
            process.exit(1);
        }
        
        throw error;
    }
}

orchestrate(orchestrateSequence, context);