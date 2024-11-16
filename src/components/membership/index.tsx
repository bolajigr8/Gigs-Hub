'use client'

import JobIcon from '../job-icon'
import { Button } from '../ui/button'
import {
  createPriceIdAction,
  createStripePaymentAction,
  updateProfileAction,
} from '@/actions'
import { loadStripe } from '@stripe/stripe-js'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { membershipPlans } from '@/utils'
import CommonCard from '../cmn-card'

const stripePromise = loadStripe(
  'pk_test_51QIha6GINIrp0oKlWvswvtqpelq6an6JQTLxie6lvOS7OqaTQv5rYLLy1D3yXGn5Qmyg5lsaUssSKYQEAyR3bzyQ00665s3hzk'
)

const Membership = ({ profileInfo }: any) => {
  // getting path name to know if the stripe checkout was a success
  const pathName = useSearchParams()

  console.log('profileInfo', profileInfo)

  // handle payment with stripe and proceeding to stripe checkout page

  async function handlePayment(getCurrentPlan: any) {
    const stripe: any = await stripePromise
    const extractPriceId = await createPriceIdAction({
      amount: Number(getCurrentPlan?.price),
    })

    if (extractPriceId) {
      sessionStorage.setItem('currentPlan', JSON.stringify(getCurrentPlan))
      const result = await createStripePaymentAction({
        lineItems: [
          {
            price: extractPriceId?.id,
            quantity: 1,
          },
        ],
      })

      console.log(result)

      // takes us to stripe checkout page
      await stripe.redirectToCheckout({
        sessionId: result?.id,
      })
    }

    console.log(extractPriceId)
  }

  // update profile
  async function updateProfile() {
    const fetchCurrentPlanFromSessionStroage = JSON.parse(
      sessionStorage.getItem('currentPlan') || '{}'
    )

    await updateProfileAction(
      {
        ...profileInfo,
        isPremiumUser: true,
        memberShipType: fetchCurrentPlanFromSessionStroage?.type,
        memberShipStartDate: new Date().toString(),
        memberShipEndDate: new Date(
          new Date().getFullYear() +
            fetchCurrentPlanFromSessionStroage?.type ===
          'basic'
            ? 1
            : fetchCurrentPlanFromSessionStroage?.plan === 'teams'
            ? 2
            : 5,
          new Date().getMonth(),
          new Date().getDay()
        ),
      },
      '/membership'
    )
  }

  // if the pathname status contains success, update profile
  useEffect(() => {
    if (pathName?.get('status') === 'success') updateProfile()
  }, [pathName])

  console.log('profileInfo', profileInfo)

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='flex items-baseline dark:border-white justify-between border-b pb-6 pt-24'>
        <h1 className='text-4xl font-bold dark:text-white tracking-tight text-gray-950'>
          {profileInfo?.isPremiumUser
            ? 'You are a premium user'
            : 'Choose Your Best Plan'}
        </h1>
        {/* to specify what plan */}
        <div>
          {profileInfo?.isPremiumUser ? (
            <Button className='flex dark:text-black  h-11 items-center justify-center px-5'>
              {
                membershipPlans.find(
                  (planItem) => planItem.type === profileInfo?.memberShipType
                )?.heading
              }
            </Button>
          ) : null}
        </div>
      </div>
      <div className='py-20 pb-24 pt-6'>
        <div className='container mx-auto p-0 space-y-8'>
          <div className='grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3'>
            {membershipPlans.map((plan, index) => (
              <CommonCard
                icon={
                  <div className='flex justify-between'>
                    <div>
                      <JobIcon width={0} height={0} />
                    </div>
                    <h1 className='dark:text-black  font-bold text-2xl'>
                      {plan.heading}
                    </h1>
                  </div>
                }
                title={`$ ${plan.price} /yr`}
                description={plan.type}
                footerContent={
                  profileInfo?.memberShipType === 'enterprise' ||
                  (profileInfo?.memberShipType === 'basic' && index === 0) ||
                  (profileInfo?.memberShipType === 'teams' &&
                  index >= 0 &&
                  index < 2 ? null : (
                    <Button
                      onClick={() => handlePayment(plan)}
                      className='disabled:opacity-65 dark:bg-gray-950 dark:text-gray-200 flex h-11 items-center justify-center px-5'
                    >
                      {profileInfo?.memberShipType === 'basic' ||
                      profileInfo?.memberShipType === 'teams'
                        ? 'Update Plan'
                        : 'Get Premium'}
                    </Button>
                  ))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Membership
