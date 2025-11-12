package org.example.authentificationwithjwt.service;

@Service
public class MyUserDetailsService implements UserDetailsService {
    private final InMemoryUserDetailsManager delegate;
    public MyUserDetailsService() {
        UserDetails user = User.withUsername("user")
                .password("{noop}password")
                .roles("USER")
                .build();
        UserDetails admin = User.withUsername("admin")
                .password("{noop}admin123")
                .roles("ADMIN")
                .build();
        this.delegate = new InMemoryUserDetailsManager(user, admin);
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return delegate.loadUserByUsername(username);
    }
}