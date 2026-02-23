import React from "react";
import { User } from "lucide-react";
import { InputField, SelectField } from "./ProfileFields";
import { GENDER_OPTIONS, BLOOD_GROUPS } from "./ProfileConstants";

export default function PersonalInfoSection({ form, onChange, edit }) {
    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <User className="text-primary-500" size={20} />
                Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                <InputField k="frist name" l="First Name" value={form["frist name"]} onChange={onChange} edit={edit} readOnly={true} />
                <InputField k="last name" l="Last Name" value={form["last name"]} onChange={onChange} edit={edit} readOnly={true} />
                <SelectField k="gender" l="Gender" value={form.gender} options={GENDER_OPTIONS} onChange={onChange} edit={edit} />
                <InputField k="dob" l="Date of Birth" value={form.dob} onChange={onChange} edit={edit} />
                <InputField k="phone" l="Phone Number" value={form.phone} onChange={onChange} edit={edit} />
                <InputField k="father name" l="Father Name" value={form["father name"]} onChange={onChange} edit={edit} />
                <InputField k="mother name" l="Mother Name" value={form["mother name"]} onChange={onChange} edit={edit} />
                <SelectField k="blood group" l="Blood Group" value={form["blood group"]} options={BLOOD_GROUPS} onChange={onChange} edit={edit} />
            </div>
        </section>
    );
}
