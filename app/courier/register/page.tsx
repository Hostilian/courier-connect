import { defaultLocale } from '@/i18n';
import { redirect } from 'next/navigation';

export default function CourierRegisterPage() {
  redirect(`/${defaultLocale}/courier/register`);
}

                        <span className="text-gray-500">Emergency Contact:</span>
                        <span className="ml-2 text-gray-900">{registration.emergencyContact} - {registration.emergencyPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={registration.agreeToTerms}
                        onChange={(e) => updateRegistration('agreeToTerms', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                      />
                      <div className="text-sm text-gray-700">
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                        . I understand that I will need to complete a background check and upload required documents before I can start accepting deliveries.
                      </div>
                    </label>
                  </div>

                  {/* Earnings Info */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900 mb-1">Earning Potential</h3>
                        <p className="text-sm text-blue-700">
                          Earn $15-30/hour depending on demand and delivery type. You keep 80% of delivery fees, 
                          and we handle all payments and customer service.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                  <button
                    onClick={submitRegistration}
                    disabled={!registration.agreeToTerms}
                    className="btn-primary bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Already have account link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/courier/login" className="text-blue-600 hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}