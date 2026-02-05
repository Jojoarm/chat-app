import { zodResolver } from '@hookform/resolvers/zod';
import {
  type SignUpFormData,
  signUpSchema,
} from '@/validations/sign-up.validation';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useRegister } from '@/hooks/use-auth-action';

const SignUp = () => {
  const mutation = useRegister();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | ''>('');

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      avatar: '',
    },
  });

  const { control, handleSubmit, setValue } = form;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
      setValue('avatar', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setValue('avatar', '');
    setAvatarUrl('');
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const onSubmit = async (data: SignUpFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="flex flex-col items-center justify-center gap-3">
            <Logo />
            <CardTitle className="text-xl">Create your account</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="johndoe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* profile picture */}
                {avatarUrl ? (
                  <div className="w-full h-50 bg-gray-200">
                    <div className="relative w-full h-full rounded-md">
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover object-top rounded-md"
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-px right-px ring-1 bg-gray-600/50  text-red-400 cursor-pointer"
                        onClick={handleRemoveImage}
                      >
                        <X className="size-7" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="avatar"
                    className="flex items-center w-full justify-between border border-gray-300/60 h-12 px-2 md:px-4 lg:px-6 mb-2 rounded-xl gap-2 overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-gray-600/80 text-xs sm:text-sm">
                      Profile Picture:
                    </p>
                    <div>
                      <Upload className="size-5 text-gray-500/80" />
                    </div>
                    <input
                      type="file"
                      ref={imageInputRef}
                      id="avatar"
                      hidden
                      aria-label="Upload Profile Picture"
                      disabled={avatarUrl !== ''}
                      onChange={handleImageChange}
                    />
                  </label>
                )}

                <Button
                  disabled={mutation.isPending}
                  type="submit"
                  className="w-full"
                >
                  {mutation.isPending && <Spinner />} Sign Up
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link to="/" className="underline">
                    Sign in
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
