import { useEffect, useCallback } from "react";
import { type UseFormReturn, type FieldValues } from "react-hook-form";
import debounce from "lodash.debounce";

/**
 * A hook that connects to a form from react-hook-form and watches for changes,
 * then automatically calls the saveFormDataToBackend function at the defined interval.
 * @param form
 * @param interval
 * @param saveFormDataToBackend
 * @param dependencies
 */
export const useAutoSaveFormData = <FormParams extends FieldValues>(
  interval = 500,
  form: UseFormReturn<FormParams>,
  saveFormDataToBackend: (data: FormParams) => void,
  dependencies: ReadonlyArray<unknown>,
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveFormDataToBackendDebounced = useCallback(
    debounce((data: FormParams) => {
      saveFormDataToBackend(data);
    }, interval),
    dependencies,
  );

  useEffect(() => {
    const subscription = form.watch((data) => {
      saveFormDataToBackendDebounced(data as FormParams);
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch, saveFormDataToBackendDebounced]);
};
