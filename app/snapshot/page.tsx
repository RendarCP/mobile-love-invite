import MobileContainer from "@/components/MobileContainer";
import PhotoUpload from "@/components/sections/PhotoUpload";

export default function SnapshotPage() {
  return (
    <MobileContainer className="h-screen flex justify-center items-center">
      <PhotoUpload />
    </MobileContainer>
  );
}
