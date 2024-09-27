import { Suspense } from "react";
import {
  SignaturesListLoader,
  SignaturesListWrapper,
} from "~/components/admin/signatures/signatures-list";

export default function SignaturesPage() {
  return (
    <section>
      <h2>Email signatures</h2>

      <Suspense fallback={<SignaturesListLoader />}>
        <SignaturesListWrapper />
      </Suspense>
    </section>
  );
}
