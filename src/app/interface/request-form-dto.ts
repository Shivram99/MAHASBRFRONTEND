export interface RequestFormDTO {
    name: string;
    email: string;
    mobile?: string;
    district:string;   // optional - since @Size max 15 but not @NotBlank
    reason: string;
    message: string;
}
