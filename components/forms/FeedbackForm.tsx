import React from 'react'
import { useRouter } from 'next/router'
import { Field, Form } from 'react-final-form'
import styled, { css } from 'styled-components'
import { Button } from 'components/ui'
import { InfoIcon } from '@tinacms/icons'

export function FeedbackForm() {
  const router = useRouter()
  const [formStatus, setFormStatus] = React.useState<
    'submitting' | 'success' | 'error'
  >(null)
  const [formOpen, setFormOpen] = React.useState<boolean>(false)
  const widgetRef = React.useRef<HTMLDivElement>(null)

  const toggleOpen = () => {
    setFormOpen(!formOpen)
    if (!widgetRef.current) return
    widgetRef.current.scrollTop = 0
  }

  function handleSubmitForm(values) {
    if (values.human) return

    setFormStatus('submitting')
    const formData = {
      Date: new Date().toDateString(),
      slug: router.asPath,
      ...values,
    }

    return fetch('/api/feedback', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(formData),
    }).then(response => {
      if (!response.ok) {
        setFormStatus('error')
        console.error(`Form not submitted: ${response.status} error`)
      } else {
        setTimeout(() => {
          setFormOpen(false)
          setFormStatus('success')
        }, 750)
      }
    })
  }

  return (
    <>
      <FormWidget open={formOpen} ref={widgetRef}>
        <FormTitle open={formOpen} onClick={toggleOpen}>
          <InfoIcon /> Was this helpful?
        </FormTitle>
        <FormWrapper open={formOpen}>
          <Form onSubmit={handleSubmitForm}>
            {props => (
              <form onSubmit={props.handleSubmit}>
                <Field
                  component={({ input }) => {
                    return <HoneyPot {...input} />
                  }}
                  type="text"
                  name="human"
                />
                <Reaction>
                  <label>
                    <Field
                      component="input"
                      id="reaction-good"
                      type="radio"
                      name="Review"
                      value="Good"
                    />
                    <span>👍</span>
                  </label>
                  <label>
                    <Field
                      component="input"
                      id="reaction-bad"
                      type="radio"
                      name="Review"
                      value="Bad"
                    />
                    <span>👎</span>
                  </label>
                </Reaction>
                <InputGroup>
                  <label htmlFor="comment">Tell us your thoughts</label>
                  <Field
                    component="textarea"
                    id="comment"
                    name="Comment"
                  ></Field>
                </InputGroup>
                <InputGroup>
                  <label htmlFor="email">
                    Your Email <em>(optional)</em>
                  </label>
                  <Field
                    component="input"
                    type="email"
                    id="email"
                    name="Email"
                  ></Field>
                </InputGroup>
                {formStatus === 'error' ? (
                  <ErrorMessage>Uh oh, Something went wrong.</ErrorMessage>
                ) : (
                  ''
                )}
                <ButtonGroup>
                  <FeedbackButton
                    color="primary"
                    type="submit"
                    formStatus={formStatus}
                  >
                    {formStatus === 'submitting'
                      ? 'Submitting...'
                      : 'Submit Feedback'}
                  </FeedbackButton>
                </ButtonGroup>
              </form>
            )}
          </Form>
        </FormWrapper>
      </FormWidget>
      <Overlay open={formOpen} onClick={toggleOpen}></Overlay>
    </>
  )
}

export interface FormWidgetProps {
  open: boolean
}

const FormWidget = styled.div<FormWidgetProps>`
  position: fixed;
  bottom: 5rem;
  right: 0;
  z-index: 550;
  padding: 1rem 1.25rem;
  max-height: calc(100vh - 4rem);
  transition: transform 300ms ease-out;
  transform: translate3d(5.5rem, 100%, 0);

  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-light);
    border-radius: 5px;
    border: 1px solid var(--color-light-dark);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
    z-index: -1;
    transition: transform 300ms ease-out;
    opacity: 0;
  }

  @media (max-width: 829px) {
    display: none;
  }

  &:hover {
    transform: translate3d(5.25rem, calc(100% - 0.25rem), 0);
  }

  ${props =>
    props.open
      ? css`
          overflow-y: auto;
          transform: translate3d(-2rem, 3rem, 0);
          z-index: 1500;

          &:hover {
            transform: translate3d(-2rem, 3rem, 0);
          }

          &:after {
            opacity: 1;
          }
        `
      : ``};
`

export interface FormTitleProps {
  open: boolean
}

const FormTitle = styled.button<FormTitleProps>`
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0 1.25rem;
  margin-top: -0.25rem;
  margin-left: -1.25rem;
  height: 45px;
  line-height: 1;
  display: block;
  font-size: 1.25rem;
  color: var(--color-primary);
  font-family: var(--font-tuner);
  position: relative;
  display: inline-block;

  svg {
    display: inline;
    width: 1.25em;
    height: 1.25em;
    fill: var(--color-primary);
    margin: -0.25em 0 -0.25em -0.25em;
    opacity: 0.9;
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 2rem;
    background: var(--color-seafoam);
    border: 1px solid var(--color-seafoam-dark);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transition: transform 300ms ease-out;
    z-index: -1;
  }

  &:active,
  &:hover,
  &:focus {
    border: none;
    outline: none;
  }

  ${props =>
    props.open
      ? css`
          &:after {
            opacity: 0;
          }
        `
      : ``};
`

const ButtonGroup = styled.div`
  padding: 1rem 0 0.5rem 0;
`

const InputGroup = styled.div`
  padding: 0.5rem 0;

  label {
    display: block;
    margin-bottom: 0.25rem;
    color: var(--color-secondary);
  }
  input,
  textarea {
    width: 20rem;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08),
      0px 2px 3px rgba(0, 0, 0, 0.12);
    border: 0;
    border-radius: 5px;
    background: white;
    color: var(--color-secondary);
    line-height: 1.2;
    white-space: nowrap;
    text-decoration: none;
    cursor: text;
    height: 40px;
    padding: 0 12px;
    transition: all 85ms ease-out;
    font-size: 16px;
    ::placeholder {
      opacity: 1;
      font-family: inherit;
      font-size: 1rem;
      transition: opacity 180ms ease-out;
    }
    &:hover {
      box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 0px 1px inset,
        rgba(236, 72, 21, 0.2) 0px 0px 0px 3px, rgba(0, 0, 0, 0.12) 0px 2px 3px;
    }
    &:focus {
      box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 0px 1px inset,
        rgba(236, 72, 21, 0.7) 0px 0px 0px 3px, rgba(0, 0, 0, 0.12) 0px 2px 3px;
    }
    &:focus,
    &:active {
      outline: none;
      ::placeholder {
        opacity: 0.5;
        transition: opacity 200ms ease;
      }
    }
  }
  textarea {
    min-height: 6rem;
    padding: 12px;
    white-space: pre-wrap;
  }
`

export interface OverlayProps {
  open: boolean
}

const Overlay = styled.div<OverlayProps>`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 400ms ease-out;
  z-index: 1350;
  pointer-events: none;

  ${props =>
    props.open
      ? css`
          opacity: 1;
          pointer-events: all;
        `
      : ``};
`

export interface FormWrapperProps {
  open: boolean
}

const FormWrapper = styled.div<FormWrapperProps>`
  display: block;
  pointer-events: none;
  transition: all 400ms ease-out;
  opacity: 0;
  width: 20rem;

  input {
    display: block;
  }

  ${props =>
    props.open
      ? css`
          opacity: 1;
          pointer-events: all;
        `
      : ``};
`

const Reaction = styled.div`
  display: block;
  padding: 0.5rem 0;

  label {
    font-size: 3.5rem;
    margin-right: 1rem;
    display: inline-block;
    cursor: pointer;
    transform: scale3d(1, 1, 1);
    transform-origin: 50% 50%;
    line-height: 1;

    &:hover {
      span {
        transform: scale3d(1.1, 1.1, 1);
        opacity: 1;
      }
    }

    &:active {
      span {
        transform: scale3d(1.15, 1.15, 1);
        opacity: 1;
      }
    }
  }

  input {
    display: none;

    &:checked + span {
      transform: scale3d(1.1, 1.1, 1);
      opacity: 1;
    }
  }

  span {
    display: inline-block;
    opacity: 0.5;
    transition: opacity 250ms ease-out,
      transform 150ms cubic-bezier(0, 0.375, 0.255, 1.275);
  }
`

const HoneyPot = styled.input`
  display: none !important;
  visibility: hidden;
  opacity: 0;
`

const FeedbackButton = styled<any>(Button)`
  ${props =>
    props.formStatus === 'submitting'
      ? css`
          pointer-events: none;
          cursor: wait;
        `
      : ``};
`

const ErrorMessage = styled.p`
  font-size: 1.125rem;
  font-weight: bold;
  color: var(--color-primary);
`
