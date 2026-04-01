import { auth } from "@/auth";
import CreatePostForm from "../../../components/posts/create-post-form/CreatePostForm";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function CreatePostPage() {
  const t = await getTranslations("CreatePostPage");
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-primary text-center">{t("title")}</h1>
      <CreatePostForm session={session} />
    </>
  );
}
